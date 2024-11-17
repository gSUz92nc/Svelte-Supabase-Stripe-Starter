<script lang="ts">
	let { data } = $props();
	const { user } = data;

	// Helper function to safely get username from email
	function getUserDisplayName(email: string | undefined | null): string {
		return email?.split('@')[0] ?? 'User';
	}
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
	<div class="container mx-auto px-4 py-16">
		{#if user}
			<header class="mb-12">
				<h1 class="text-4xl font-bold mb-4">Welcome back, {getUserDisplayName(user.email)}!</h1>
				<p class="text-gray-400">Your personal dashboard</p>
			</header>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
				<div class="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
					<h3 class="text-xl font-semibold mb-2">Account Status</h3>
					<p class="text-green-400">Active</p>
				</div>

				<div class="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
					<h3 class="text-xl font-semibold mb-2">Member Since</h3>
					<p class="text-gray-300">
						{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
					</p>
				</div>

				<div class="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
					<h3 class="text-xl font-semibold mb-2">Quick Actions</h3>
					<div class="space-x-4">
						<a href="/products" class="text-blue-400 hover:underline">Browse Products</a>
						<a href="/account/manage" class="text-blue-400 hover:underline">Settings</a>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center">
				<p>Loading user data...</p>
			</div>
		{/if}
	</div>
</main>
