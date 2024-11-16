<script lang="ts">
	let { data } = $props();
	const { session } = data;
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="container mx-auto px-4 py-16">
		<header class="text-center mb-16">
			<h1 class="text-5xl font-bold mb-4">Svelte Supabase Stripe Starter</h1>
		</header>

		<div class="grid md:grid-cols-3 gap-8 mb-16">
			{#each [{ title: 'Svelte Powered', icon: '⚡', description: 'Lightning-fast reactivity and efficient updates' }, { title: 'Supabase Integration', icon: '🗄️', description: 'Easy-to-use backend with real-time capabilities' }, { title: 'Stripe Payments', icon: '💳', description: 'Seamless payment processing for your applications' }] as feature, index}
				<div class="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
					<div class="text-4xl mb-4">{feature.icon}</div>
					<h2 class="text-2xl font-semibold mb-2">{feature.title}</h2>
					<p class="text-gray-300">{feature.description}</p>
				</div>
			{/each}
		</div>
		<div class="flex flex-col items-center justify-center space-y-4 mb-16">
			{#if !session}
				<a
					href="/auth/sign-in"
					class="inline-block bg-white text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300"
				>Sign In</a>
				<a
					href="/auth/sign-up"
					class="inline-block bg-white text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300"
				>Create Account</a>
			{:else}
				<a
					href="/home"
					class="inline-block bg-white text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300"
				>Go to Dashboard</a>
			{/if}
		</div>

		<div class="text-center">
			<h2 class="text-3xl font-semibold mb-4">Before you start editing any files</h2>
			<p class="text-gray-300 mb-8">
				Make sure you finish following the setup process which will guide you through setting up
				Supabase and Stripe. Doing this setup now will save you time later.
			</p>
			<a
				href="https://github.com/gSUz92nc/Svelte-Supabase-Stripe-Starter"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block bg-white text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300"
			>
				View on GitHub
			</a>
		</div>
	</div>
</main>
