<script lang="ts">
    import { onMount } from 'svelte';

    /** Loading state for the portal redirect */
    let loading = $state(true);
    
    /** Error message to display if something goes wrong */
    let error = $state<string | null>(null);
    
    /** Whether the user needs to subscribe first */
    let needsSubscription = $state(false);

    onMount(async () => {
        try {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'no_subscription') {
                    needsSubscription = true;
                }
                throw new Error(data.message || data.error);
            }

            window.location.href = data.url;
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unknown error occurred';
            loading = false;
        }
    });
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center">
            {#if loading}
                <div class="flex flex-col items-center justify-center">
                    <svg
                        class="animate-spin h-5 w-5 text-white mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p>Redirecting to billing portal...</p>
                </div>
            {:else if error}
                <div class="text-red-400 mb-4">{error}</div>
                {#if needsSubscription}
                    <p class="text-gray-300 mb-4">
                        You need an active subscription to access the billing portal.
                    </p>
                    <a href="/products" class="text-blue-400 hover:underline">View pricing plans</a>
                {:else}
                    <a href="/home" class="text-blue-400 hover:underline">Back to home</a>
                {/if}
            {/if}
        </div>
    </div>
</main>
