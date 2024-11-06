<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';

    let { data } = $props();
    const { supabase, session } = $derived(data);

    let newPassword = $state('');
    let confirmPassword = $state('');
    let loading = $state(false);
    let error = $state<string | null>(null);
    let success = $state<string | null>(null);

    async function handleUpdatePassword() {
        try {
            loading = true;
            error = null;
            success = null;

            // Validate passwords match
            if (newPassword !== confirmPassword) {
                throw new Error("New passwords don't match");
            }

            // Update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            success = 'Password updated successfully';
            newPassword = '';
            confirmPassword = '';

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
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Update Password</h2>
        </div>
        <form class="mt-8 space-y-6" onsubmit={preventDefault(handleUpdatePassword)}>
            {#if error}
                <div class="rounded-md bg-red-50 p-4">
                    <div class="text-sm text-red-700">
                        {error}
                    </div>
                </div>
            {/if}
            {#if success}
                <div class="rounded-md bg-green-50 p-4">
                    <div class="text-sm text-green-700">
                        {success}
                    </div>
                </div>
            {/if}
            <div class="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="newPassword" class="sr-only">New Password</label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        bind:value={newPassword}
                        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="New Password"
                    />
                </div>
                <div>
                    <label for="confirmPassword" class="sr-only">Confirm New Password</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        bind:value={confirmPassword}
                        class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm New Password"
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
                    Update Password
                </button>
            </div>
        </form>
    </div>
</div>