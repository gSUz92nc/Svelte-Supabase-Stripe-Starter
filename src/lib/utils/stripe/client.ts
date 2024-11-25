/**
 * Singleton pattern for Stripe client instance
 * Ensures only one instance of Stripe is loaded on the client side
 */

import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');
	}

	return stripePromise;
};
