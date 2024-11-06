<script lang="ts">
    import { onMount } from 'svelte';
    import { getStripe } from '$lib/utils/stripe/client.js'

    // Define types based on your database schema
    interface Price {
        id: string;
        product_id: string;
        active: boolean;
        currency: string;
        interval?: 'day' | 'week' | 'month' | 'year';
        interval_count?: number;
        unit_amount: number;
        type: 'one_time' | 'recurring';
    }

    interface Product {
        id: string;
        name: string;
        description: string | null;
        active: boolean;
        image: string | null;
        prices?: Price[];
    }
    
    interface Subscription {
        id: string;
        user_id: string;
        status: string;
        price_id: string;
        quantity: number;
        cancel_at_period_end: boolean;
        created: string;
        current_period_start: string;
        current_period_end: string;
        ended_at: string | null;
        cancel_at: string | null;
        canceled_at: string | null;
        trial_start: string | null;
        trial_end: string | null;
        prices?: PriceWithProduct | null;
    }
    
    interface ProductWithPrices extends Product {
        prices: Price[];
    }
    
    interface PriceWithProduct extends Price {
        products: Product | null;
    }
    
    interface SubscriptionWithProduct extends Subscription {
        prices: PriceWithProduct | null;
    }
    
    type BillingInterval = 'lifetime' | 'year' | 'month';
    

    let { data } = $props();
    const { supabase } = $derived(data);

    let products: Product[] = $state([]);
    let loading = $state(true);

    async function fetchProducts() {
        try {
            const { data: productsData, error: supabaseError } = await supabase
                .from('products')
                .select(`
                    *,
                    prices (
                        *
                    )
                `)
                .eq('active', true)
                .order('name');

            if (supabaseError) throw supabaseError;

            products = productsData as Product[];
        } catch (e) {
            console.log(e)
        } finally {
            loading = false;
        }
    }

    function formatPrice(price: Price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency,
            minimumFractionDigits: 0
        }).format(price.unit_amount / 100);
    }

    function initializeProductsSubscription() {
        fetchProducts();

        const subscription = supabase
            .channel('public:products')
            .on('postgres_changes', 
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

    onMount(initializeProductsSubscription);
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <div class="container mx-auto px-4 py-16">
        <header class="text-center mb-16">
            <h1 class="text-5xl font-bold mb-4">Our Products</h1>
        </header>

        {#if loading}
            <div class="text-center">
                <p>Loading products...</p>
            </div>
        {:else if products.length === 0}
            <div class="text-center">
                <p>No products available.</p>
            </div>
        {:else}
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each products as product}
                    <div class="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden">
                        {#if product.image}
                            <img 
                                src={product.image} 
                                alt={product.name}
                                class="w-full h-48 object-cover"
                            />
                        {/if}
                        <div class="p-6">
                            <h2 class="text-2xl font-semibold mb-2">{product.name}</h2>
                            <p class="text-gray-300 mb-4">{product.description}</p>

                            {#if product.prices && product.prices.length > 0}
                                <div class="space-y-2">
                                    {#each product.prices.filter(price => price.active) as price}
                                        <div class="flex justify-between items-center">
                                            <span>
                                                {formatPrice(price)}
                                                {#if price.type === 'recurring'}
                                                    /{price.interval}
                                                {/if}
                                            </span>
                                            <button
                                                class="bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-200 transition duration-300"
                                            >
                                                Subscribe
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</main>