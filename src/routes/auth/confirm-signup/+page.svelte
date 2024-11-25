<!-- This page is here purely for email prefetching things like Outlook safelinks. More info here: https://supabase.com/docs/guides/auth/auth-email-templates#email-prefetching -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const confirmationUrl = $page.url.searchParams.get('confirmation_url');
	let error = $state<string | null>(null);
	let loading = $state(false);

	/**
	 * Handles the email confirmation process for new signups
	 * @async
	 * @throws {Error} If confirmation URL is missing or invalid
	 * @returns {Promise<void>}
	 */
	async function handleConfirmation(): Promise<void> {
		try {
			loading = true;
			if (!confirmationUrl) throw new Error('No confirmation URL found');

			const url = new URL(confirmationUrl);
			const token_hash = url.searchParams.get('token_hash');

			// Only handle signup confirmation
			await goto(`/auth/confirm?token_hash=${token_hash}&type=signup&next=/home`);
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
			loading = false;
		}
	}
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="container mx-auto px-4 py-16">
		<header class="text-center mb-16">
			<h1 class="text-5xl font-bold mb-4">Confirm Your Email</h1>
			<p class="text-gray-300">Please click the button below to confirm your email address.</p>
		</header>

		<div class="max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center">
			{#if error}
				<div class="rounded-md bg-red-900 bg-opacity-50 p-4 mb-6">
					<div class="text-sm text-red-200">{error}</div>
				</div>
			{/if}

			<button
				onclick={handleConfirmation}
				disabled={loading}
				class="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium"
			>
				{#if loading}
					<span class="inline-flex items-center">
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
						Confirming...
					</span>
				{:else}
					Confirm Email Address
				{/if}
			</button>
		</div>
	</div>
</main>
