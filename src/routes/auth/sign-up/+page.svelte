<main class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <div class="container mx-auto px-4 py-16">
        <header class="text-center mb-16">
            <h1 class="text-5xl font-bold mb-4">Create Account</h1>
            <p class="text-gray-300">Join us today and get started with your new account.</p>
        </header>

        <div class="max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-lg">
            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium mb-2" for="email">
                        Email Address
                    </label>
                    <input name="email" type="email" class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="password">
                        Password
                    </label>
                    <input name="password" type="password" class="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button class="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign up</button>
            </form>
            <nav class="mt-8 text-center">
                <a href="/auth/sign-in" class="text-sm text-gray-400 hover:underline">Already have an account? Sign in</a>
            </nav>
        </div>
    </div>
</main>