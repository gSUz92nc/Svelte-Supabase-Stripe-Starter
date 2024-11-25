import type { Actions } from '@sveltejs/kit';
import { checkoutWithStripe } from '$lib/utils/stripe/server';
import type { Tables } from '$lib/types_db';

/**
 * Handles product checkout form submissions.
 * Validates user authentication and initiates the Stripe checkout process.
 * Returns session ID for successful checkout initialization or error details.
 */

export const actions = {
	checkout: async ({ request, locals: { safeGetSession } }) => {
		const formData = await request.formData();
		const priceData = JSON.parse(formData.get('price') as string) as Tables<'prices'>;
		const returnUrl = formData.get('returnUrl') as string;

		const { user } = await safeGetSession();

		console.log(user);

		if (!user) {
			return {
				status: 401,
				error: 'Unauthorized, checkout failed.'
			};
		}

		try {
			console.log('Creating checkout session');

			const result = await checkoutWithStripe(priceData, returnUrl, user);

			console.log(result);

			if (result.sessionId) {
				return {
					success: true,
					sessionId: result.sessionId
				};
			} else if (result.errorRedirect) {
				return {
					status: 400,
					errorRedirect: result.errorRedirect
				};
			} else {
				return {
					status: 500,
					error: 'Failed to create checkout session'
				};
			}
		} catch (error) {
			return {
				status: 500,
				error: 'Failed to create checkout session'
			};
		}
	}
} satisfies Actions;
