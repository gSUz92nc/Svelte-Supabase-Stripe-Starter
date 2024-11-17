/**
 * Root layout module handling Supabase authentication and client initialization.
 * This layout runs on both server and client side, providing authentication state
 * and Supabase client instance to all child routes.
 */

import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';
import type { Database } from '$lib/types_db';

/**
 * Load function for the root layout
 * @param {Object} params - Layout load parameters
 * @param {any} params.data - Server-side data including cookies
 * @param {Function} params.depends - Function to declare dependencies
 * @param {Function} params.fetch - Fetch instance for making requests
 * @returns {Promise<{session: Session|null, supabase: SupabaseClient, user: User|null}>}
 */
export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    /**
     * Declare a dependency on 'supabase:auth' to ensure the layout refreshes
     * when authentication state changes (e.g., login, logout, session refresh)
     */
    depends('supabase:auth');

    /**
     * Initialize Supabase client based on environment (browser vs server)
     * Browser client uses simple configuration while server client requires cookie handling
     */
    const supabase = isBrowser()
        ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
                global: {
                    fetch
                }
            })
        : createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
                global: {
                    fetch
                },
                cookies: {
                    getAll() {
                        return data.cookies;
                    }
                }
            });

    /**
     * Fetch current session and user data
     * These will be available to all child routes through the layout data
     */
    const {
        data: { session }
    } = await supabase.auth.getSession();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    return { session, supabase, user };
};
