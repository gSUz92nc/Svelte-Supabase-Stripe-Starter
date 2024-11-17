import { redirect } from '@sveltejs/kit'
import { type EmailOtpType } from '@supabase/supabase-js'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {

  const {
    url,
    locals: { supabase },
  } = event
  const token_hash = url.searchParams.get('token_hash') as string
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/home'

  /**
   * Clean up the redirect URL by deleting the Auth flow parameters.
   *
   * `next` is preserved for now, because it's needed in the error case.
   */
  const redirectTo = new URL(url)
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (!token_hash || !type) {
    redirect(303, '/auth/error')
  }

  const { error } = await supabase.auth.verifyOtp({ token_hash, type })
  if (error) {
    console.error('Verification error:', error.message)
    redirect(303, '/auth/error')
  }

  redirect(303, next)
}