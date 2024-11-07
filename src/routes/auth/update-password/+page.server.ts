import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';

export const load = async ({ url, locals: { supabase} }: RequestEvent) => {
  
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (error) {
      redirect(303, "/auth/error")
    }
  }
  
  // Clean up the redirect URL by deleting the Auth flow parameters.
  const redirectTo = new URL(url)
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  
}