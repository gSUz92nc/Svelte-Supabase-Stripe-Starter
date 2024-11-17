<script lang="ts">
	import { onMount } from 'svelte';
	import { getStripe } from '$lib/utils/stripe/client';
	import { page } from '$app/stores';
	import type { Tables } from '$lib/types_db';

	type Product = Tables<'products'> & {
		prices: Price[];
	};
	type Price = Tables<'prices'>
	type Subscription = Tables<'subscriptions'>

	let { data } = $props();
	const { supabase, user } = $derived(data);


	// State variables for managing products and loading states
	let products = $state<Product[]>([]);
	let loading = $state(true);
	let subscriptions = $state<Subscription[]>([]);
	let loadingPriceId = $state<string | null>(null);

	/**
	 * Fetches all active products from Supabase with their associated prices
	 * Orders products by name and filters for active status
	 * @async
	 * @throws {Error} If the Supabase query fails
	 * @returns {Promise<void>}
	 */
	async function fetchProducts(): Promise<void> {
		try {
			const { data: productsData, error: supabaseError } = await supabase
				.from('products')
				.select(
					`
                    *,
                    prices (
                        *
                    )
                `
				)
				.eq('active', true)
				.order('name');

			if (supabaseError) throw supabaseError;

			products = productsData;
		} catch (e) {
			console.log(e);
		} finally {
			loading = false;
		}
	}

	/**
	 * Formats a price into a human-readable string with appropriate currency symbol
	 * @param {Price} price - The price object to format
	 * @returns {string} Formatted price string with currency symbol
	 */
	function formatPrice(price: Price): string {
		// Check if price object is valid
		if (price.unit_amount && price.currency) {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: price.currency || '',
				minimumFractionDigits: 0
			}).format((price.unit_amount ?? 0) / 100);
		} else {
			// Handle errorneous price object
			return 'Error while formatting price';
		}
	}

	/**
	 * Checks if the user has any active or trialing subscriptions
	 * @returns {boolean} True if user has active subscriptions, false otherwise
	 */
	function hasActiveSubscriptions(): boolean {
		return subscriptions.length > 0;
	}

	/**
	 * Sets up real-time subscription for product updates using Supabase
	 * @returns {Function} Cleanup function to unsubscribe from the channel
	 */
	function initializeProductsSubscription(): Function {
		fetchProducts();

		const subscription = supabase
			.channel('public:products')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'products'
				},
				() => {
					fetchProducts();
				}
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	}

	/**
	 * Handles the Stripe checkout process for a selected price
	 * @async
	 * @param {Price} price - The price object for the selected product
	 * @throws {Error} If the checkout process fails
	 * @returns {Promise<void>}
	 */
	async function handleStripeCheckout(price: Price): Promise<void> {
		if (!user || loadingPriceId) {
			return;
		}

		try {
			loadingPriceId = price.id;
			const form = new FormData();
			form.append('price', JSON.stringify(price)); // Send the entire price object
			form.append('returnUrl', $page.url.pathname);

			const response = await fetch('?/checkout', {
				method: 'POST',
				body: form
			});

			const result = await response.json();

			if (result.success && result.sessionId) {
				const stripe = await getStripe();
				stripe?.redirectToCheckout({ sessionId: result.sessionId });
			} else if (result.errorRedirect) {
				// Handle error redirect
				window.location.href = result.errorRedirect;
			} else if (result.error) {
				// Handle error message
				console.error('Checkout error:', result.error);
			}
		} catch (error) {
			console.error('Checkout error:', error);
		} finally {
			loadingPriceId = null;
		}
	}

	/**
	 * Fetches the user's current subscription status
	 * @async
	 * @throws {Error} If the Supabase query fails
	 * @returns {Promise<Subscription[]>} Array of active or trialing subscriptions
	 */
	async function getSubscriptionStatus(): Promise<Subscription[]> {
		if (!user) return [];

		const { data: subscriptionData, error: supabaseError } = await supabase
			.from('subscriptions')
			.select(`*, prices (*,products (*))`)
			.in('status', ['trialing', 'active']);

		if (supabaseError) throw supabaseError;

		subscriptions = subscriptionData;

		return subscriptions;
	}

	onMount(() => {
		initializeProductsSubscription();
		getSubscriptionStatus();
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="container mx-auto px-4 py-16">
		<!-- Header Section -->
		<header class="text-center mb-16">
			<h1 class="text-5xl font-bold mb-4">Our Products</h1>
		</header>

		<!-- Loading State -->
		{#if loading}
			<div class="text-center">
				<p>Loading products...</p>
			</div>
			<!-- Empty State -->
		{:else if products.length === 0}
			<div class="text-center">
				<p>No products available.</p>
			</div>
			<!-- Products Grid -->
		{:else}
			<div class="flex flex-wrap gap-10 justify-items-center justify-center">
				{#each products as product}
					<div class="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden w-[25rem]">
						<!-- Product Image -->
						{#if product.image}
							<img src={product.image} alt={product.name} class="w-full h-48 object-cover" />
						{/if}

						<!-- Product Details -->
						<div class="p-6">
							<h2 class="text-2xl font-semibold mb-2">{product.name}</h2>
							<p class="text-gray-300 mb-4">{product.description}</p>

							<!-- Pricing Section -->
							{#if product.prices && product.prices.length > 0}
								<div class="space-y-2">
									{#if hasActiveSubscriptions()}
										<!-- Show manage button if user has any subscription -->
										<div class="flex justify-end">
											<a
												href="/account/manage"
												class="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300"
											>
												Manage Subscription
											</a>
										</div>
									{:else}
										<!-- Show purchase/subscribe buttons if user has no subscriptions -->
										{#each product.prices.filter((price) => price.active) as price}
											<div class="flex justify-between items-center">
												<span>
													{formatPrice(price)}
													{#if price.type === 'recurring'}
														/{price.interval}
													{/if}
												</span>
												<button
													class="bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
													onclick={() => handleStripeCheckout(price)}
													disabled={loadingPriceId === price.id}
												>
													{#if loadingPriceId === price.id}
														<span class="inline-flex items-center">
															<svg
																class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
															>
																<circle
																	class="opacity-25"
																	cx="12"
																	cy="12"
																	r="10"
																	stroke="currentColor"
																	stroke-width="4"
																></circle>
																<path
																	class="opacity-75"
																	fill="currentColor"
																	d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																></path>
															</svg>
															Processing...
														</span>
													{:else}
														{price.type === 'recurring' ? 'Subscribe' : 'Buy Now'}
													{/if}
												</button>
											</div>
										{/each}
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>
