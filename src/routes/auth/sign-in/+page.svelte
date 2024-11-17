<script lang="ts">
    /**
     * State variable to track loading state during form submission
     */
    let loading = $state(false);

    /**
     * Handles form submission and sets loading state
     * Form will submit naturally, loading state will be reset on navigation
     */
    function onSubmit() {
        loading = true;
    }
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="container mx-auto px-4 py-16">
		<header class="text-center mb-16">
			<h1 class="text-5xl font-bold mb-4">Sign In</h1>
			<p class="text-gray-300">Welcome back! Please sign in to your account.</p>
		</header>

		<div class="max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-lg">
			<form method="POST" class="space-y-6" onsubmit={() => onSubmit()}>
				<div>
					<label class="block text-sm font-medium mb-2" for="email"> Email Address </label>
					<input
						name="email"
						type="email"
						class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2" for="password"> Password </label>
					<input
						name="password"
						type="password"
						class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button
					class="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={loading}
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
							Signing in...
						</span>
					{:else}
						Login
					{/if}
				</button>
			</form>
			<nav class="mt-8 text-center">
				<a href="/auth/forgot-password" class="text-sm text-gray-400 hover:underline"
					>Forgot your password?</a
				>
				<br />
				<a href="/auth/sign-up" class="text-sm text-gray-400 hover:underline"
					>Don't have an account? Sign up</a
				>
			</nav>
		</div>
	</div>
</main>
