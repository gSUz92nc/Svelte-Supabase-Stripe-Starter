<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();
	const { supabase } = $derived(data);

	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	/**
	 * Handles the password reset request process
	 * @async
	 * @throws {Error} If email is invalid or request fails
	 * @returns {Promise<void>}
	 */
	async function handleOTPLoginToUpdatePassword() {
		try {
			loading = true;
			error = null;

			const { data, error: signInError } = await supabase.auth.resetPasswordForEmail(email);

			if (signInError) throw signInError;

			if (data) {
				goto('/auth/verify-email');
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'An unknown error occurred';
			}
		} finally {
			loading = false;
		}
	}

	/**
	 * Wraps event handler to prevent form submission
	 * @param {function} fn - The function to wrap
	 * @returns {function} Event handler that prevents default behavior
	 */
	function preventDefault(fn: (event: Event) => void) {
		return function (event: Event) {
			event.preventDefault();
			fn(event);
		};
	}
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="container mx-auto px-4 py-16">
		<header class="text-center mb-16">
			<h1 class="text-5xl font-bold mb-4">Reset Password</h1>
			<p class="text-gray-300">Enter your email to receive password reset instructions.</p>
		</header>

		<div class="max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-lg">
			<form class="space-y-6" onsubmit={preventDefault(handleOTPLoginToUpdatePassword)}>
				{#if error}
					<div class="rounded-md bg-red-900 bg-opacity-50 p-4">
						<div class="text-sm text-red-200">
							{error}
						</div>
					</div>
				{/if}
				<div>
					<label class="block text-sm font-medium mb-2" for="email"> Email Address </label>
					<input
						id="email"
						name="email"
						type="email"
						required
						bind:value={email}
						class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
						placeholder="Enter your email"
					/>
				</div>

				<button
					type="submit"
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
							Processing...
						</span>
					{:else}
						Reset Password
					{/if}
				</button>
			</form>

			<nav class="mt-8 text-center">
				<a href="/auth/sign-in" class="text-sm text-gray-400 hover:underline"> Back to Sign In </a>
			</nav>
		</div>
	</div>
</main>
