<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const { supabase, session } = $derived(data);

	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleSignUp() {
		try {
			loading = true;
			error = null;

			const { data, error: signInError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "/auth/update-password"});

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

	function preventDefault(fn: (event: Event) => void) {
		return function (event: Event) {
			event.preventDefault();
			fn(event);
		};
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
		</div>
		<form class="mt-8 space-y-6" onsubmit={preventDefault(handleSignUp)}>
			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="text-sm text-red-700">
						{error}
					</div>
				</div>
			{/if}
			<div class="rounded-md shadow-sm -space-y-px">
				<div>
					<label for="email" class="sr-only">Email address</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						bind:value={email}
						class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Email address"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					{#if loading}
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
							<!-- Loading spinner -->
							<svg
								class="animate-spin h-5 w-5 text-white"
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
						</span>
					{/if}
					Forgot password
				</button>
			</div>
		</form>

		<div class="text-sm text-center">
			<a href="/auth/sign-up" class="font-medium text-indigo-600 hover:text-indigo-500">
				Don't have an account? Sign up
			</a>
		</div>
	</div>
</div>
