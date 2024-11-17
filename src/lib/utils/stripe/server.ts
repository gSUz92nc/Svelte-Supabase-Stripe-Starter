import Stripe from 'stripe';
import { stripe } from '$lib/utils/stripe/config';
import { createOrRetrieveCustomer } from '$lib/utils/supabase/admin';
import { getURL, calculateTrialEndUnixTimestamp } from '$lib/utils/helpers';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Tables } from '$lib/types_db';

const supabaseUrl = PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Price = Tables<'prices'>;

type CheckoutResponse = {
	errorRedirect?: string;
	sessionId?: string;
};

/**
 * Creates a Stripe checkout session for subscription
 * @param {Price} price - The price object containing product and payment details
 * @param {string} redirectPath - Path to redirect after successful checkout
 * @param {any} user - User object from authentication
 * @returns {Promise<CheckoutResponse>} Checkout session ID or error redirect URL
 */
export async function checkoutWithStripe(
	price: Price,
	redirectPath: string = '/account',
	user: any
): Promise<CheckoutResponse> {
	try {
		// Get the user, don't need to verify since it has already been done on the server action
		if (!user) {
			throw new Error('Could not get user session.');
		}

		// Retrieve or create the customer in Stripe
		let customer: string;
		try {
			customer = await createOrRetrieveCustomer({
				uuid: user?.id || '',
				email: user?.email || ''
			});
		} catch (err) {
			console.error(err);
			throw new Error('Unable to access customer record.');
		}

		let params: Stripe.Checkout.SessionCreateParams = {
			allow_promotion_codes: true,
			billing_address_collection: 'required',
			customer,
			customer_update: {
				address: 'auto'
			},
			line_items: [
				{
					price: price.id,
					quantity: 1
				}
			],
			cancel_url: getURL(),
			success_url: getURL(redirectPath)
		};

		console.log('Trial end:', calculateTrialEndUnixTimestamp(price.trial_period_days));
		if (price.type === 'recurring') {
			params = {
				...params,
				mode: 'subscription',
				subscription_data: {
					trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
				}
			};
		} else if (price.type === 'one_time') {
			params = {
				...params,
				mode: 'payment'
			};
		}

		// Create a checkout session in Stripe
		let session;
		try {
			session = await stripe.checkout.sessions.create(params);
		} catch (err) {
			console.error(err);
			throw new Error('Unable to create checkout session.');
		}

		// Instead of returning a Response, just return the data or error.
		if (session) {
			return { sessionId: session.id };
		} else {
			throw new Error('Unable to create checkout session.');
		}
	} catch (error) {
		if (error instanceof Error) {
			return {
				errorRedirect: `${redirectPath}?error=${encodeURIComponent(
					error.message
				)}&message=${encodeURIComponent('Please try again later or contact a system administrator.')}`
			};
		} else {
			return {
				errorRedirect: `${redirectPath}?error=${encodeURIComponent(
					'An unknown error occurred.'
				)}&message=${encodeURIComponent('Please try again later or contact a system administrator.')}`
			};
		}
	}
}

/**
 * Creates a Stripe customer portal session for managing subscriptions
 * @param {string} currentPath - Current application path
 * @returns {Promise<string>} Portal URL or error redirect URL
 */
export async function createStripePortal(currentPath: string): Promise<string> {
	try {
		const {
			error,
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			if (error) {
				console.error(error);
			}
			throw new Error('Could not get user session.');
		}

		let customer;
		try {
			customer = await createOrRetrieveCustomer({
				uuid: user.id || '',
				email: user.email || ''
			});
		} catch (err) {
			console.error(err);
			throw new Error('Unable to access customer record.');
		}

		if (!customer) {
			throw new Error('Could not get customer.');
		}

		try {
			const { url } = await stripe.billingPortal.sessions.create({
				customer,
				return_url: getURL('/account')
			});
			if (!url) {
				throw new Error('Could not create billing portal');
			}
			return url;
		} catch (err) {
			console.error(err);
			throw new Error('Could not create billing portal');
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return `${currentPath}?error=${encodeURIComponent(
				error.message
			)}&message=${encodeURIComponent('Please try again later or contact a system administrator.')}`;
		} else {
			return `${currentPath}?error=${encodeURIComponent(
				'An unknown error occurred.'
			)}&message=${encodeURIComponent('Please try again later or contact a system administrator.')}`;
		}
	}
}
