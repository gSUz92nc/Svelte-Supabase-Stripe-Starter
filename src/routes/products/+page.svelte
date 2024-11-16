<script lang="ts">
	import { onMount } from 'svelte';
	import { getStripe } from '$lib/utils/stripe/client';
	import { page } from '$app/stores';
	import type { Database } from '$lib/types_db';

	type Product = Database['public']['Tables']['products']['Row'] & {
		prices: Database['public']['Tables']['prices']['Row'][];
	};

	type Price = Database['public']['Tables']['prices']['Row'];

	type Subscription = Database['public']['Tables']['subscriptions']['Row'] & {
		prices: Price | null;
	};

	let { data } = $props();
	const { supabase, user } = $derived(data);

	let products = $state<Product[]>([]);
	let loading = $state(true);
	let subscriptions = $state<Subscription[]>([]);

	/** 
	 * Fetch all products from Supabase with their associated prices
	 */
	async function fetchProducts() {
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
	 * Format price to human readable string with currency symbol
	 * @param price - The price object containing unit_amount and currency
	 */
	function formatPrice(price: Price) {
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
	 * Check if the user has any active or trialing subscriptions
	 */
	function hasActiveSubscriptions(): boolean {
		return subscriptions.length > 0;
	}

	/**
	 * Initialize real-time subscription for products updates
	 */
	function initializeProductsSubscription() {
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
	 * Handle Stripe checkout process
	 * @param price - The price object for the selected product
	 */
	async function handleStripeCheckout(price: Price) {
		if (!user) {
			return;
		}

		const form = new FormData();
		form.append('price', JSON.stringify(price)); // Send the entire price object
		form.append('returnUrl', $page.url.pathname);

		const response = await fetch('?/checkout', {
			method: 'POST',
			body: form
		});

		const result = await response.json();
		const sessionId = JSON.parse(result.data)[2];

		if (sessionId) {

			const stripe = await getStripe();

			stripe?.redirectToCheckout({ sessionId });
		} else if (result.errorRedirect) {
			// Handle error redirect
			window.location.href = result.errorRedirect;
		}
	}

	/**
	 * Fetch user's subscription status
	 */
	async function getSubscriptionStatus() {

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
												>
													{price.type === 'recurring' ? 'Subscribe' : 'Buy Now'}
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
