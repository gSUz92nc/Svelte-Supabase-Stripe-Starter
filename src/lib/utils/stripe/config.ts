import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// TODO: [IMPORTANT] Review and update Stripe configuration before deployment

export const stripe = new Stripe(
	STRIPE_SECRET_KEY ?? '',
	{
		// https://github.com/stripe/stripe-node#configuration
		// https://stripe.com/docs/api/versioning
		// @ts-ignore
		apiVersion: "2024-10-28.acacia",
		// Register this as an official Stripe plugin.
		// https://stripe.com/docs/building-plugins#setappinfo
		appInfo: {
			name: 'Next.js Subscription Starter',
			version: '0.0.0',
			url: 'https://github.com/vercel/nextjs-subscription-payments'
		}
	}
);
