import type { Actions } from '@sveltejs/kit';
import { checkoutWithStripe } from '$lib/utils/stripe/server';
import type { Tables } from '$lib/types_db';

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
		
		console.log("Creating checkout session")
		
			const result = await checkoutWithStripe(priceData, returnUrl, user);
			
			console.log(result)

			return {
				success: true,
				sessionId: result.sessionId
			};
		} catch (error) {
			return {
				status: 500,
				error: 'Failed to create checkout session'
			};
		}
	}
} satisfies Actions;
