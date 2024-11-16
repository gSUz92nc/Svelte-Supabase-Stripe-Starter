import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// TODO: [IMPORTANT] Review and update Stripe configuration before deployment

export const stripe = new Stripe(
	STRIPE_SECRET_KEY ?? '',
	{
		// https://github.com/stripe/stripe-node#configuration
		// https://stripe.com/docs/api/versioning
		// @ts-ignore
		apiVersion: "latest",
		// Register this as an official Stripe plugin.
		// https://stripe.com/docs/building-plugins#setappinfo
		appInfo: {
			name: 'Svelte Supabase Stripe Starter',
			version: '0.0.0',
			url: 'https://github.com/gSUz92nc/Svelte-Supabase-Stripe-Starter'
		}
	}
);
