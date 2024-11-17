import { json } from '@sveltejs/kit';
import { stripe } from '$lib/utils/stripe/config';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function ({ request, locals: { user } }) {
	try {
		const { price, returnUrl } = await request.json();

		console.log(price, user, returnUrl);

		if (!user) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		const customer = await stripe.customers.create({
			email: user.email,
			metadata: {
				userId: user.id
			}
		});

		const session = await stripe.checkout.sessions.create({
			customer: customer.id,
			billing_address_collection: 'required',
			line_items: [
				{
					price: price.id,
					quantity: 1
				}
			],
			mode: price.type === 'recurring' ? 'subscription' : 'payment',
			success_url: `${process.env.PUBLIC_SITE_URL}${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.PUBLIC_SITE_URL}${returnUrl}`,
			metadata: {
				userId: user.id
			}
		});

		return json({ sessionId: session.id });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json({ error: 'Error creating checkout session' }, { status: 500 });
	}
};
