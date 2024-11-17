/**
 * Server-side layout loader that provides session data
 * and cookies to the client-side layout.
 */

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();
	return {
		session,
		cookies: cookies.getAll()
	};
};
