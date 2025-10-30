/**
 * Server Actions for authentication
 * Handles signup, login, and logout operations
 */

'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { executeAction } from '@/lib/action-response'
import type { ActionResponse } from '@/lib/action-response'

/**
 * Server Action: Sign up with email and password
 * Validates inputs and creates new user account
 */
export async function signUpAction(
  email: string,
  password: string,
): Promise<ActionResponse<{ message: string }>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message || 'Failed to sign up')
    }

    return {
      message: 'Account created successfully. Please check your email to confirm.',
    }
  })
}

/**
 * Server Action: Sign in with email and password
 */
export async function signInAction(
  email: string,
  password: string,
): Promise<ActionResponse<{ message: string }>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message || 'Failed to sign in')
    }

    return {
      message: 'Signed in successfully',
    }
  })
}

/**
 * Server Action: Sign in with Google OAuth
 * Returns the OAuth URL for client-side redirect
 */
export async function signInWithGoogleAction(): Promise<
  ActionResponse<{ url: string }>
> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    // Determine the base URL for OAuth redirects.
    // Priority: explicit NEXT_PUBLIC_SITE_URL > Vercel env URL > localhost
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message || 'Failed to initiate Google sign in')
    }

    if (!data.url) {
      throw new Error('No OAuth URL returned')
    }

    return {
      url: data.url,
    }
  })
}

/**
 * Server Action: Sign out current user
 */
export async function signOutAction(): Promise<ActionResponse<{ message: string }>> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message || 'Failed to sign out')
    }

    return {
      message: 'Signed out successfully',
    }
  })
}

/**
 * Server Action: Get current user session
 */
export async function getCurrentUserAction(): Promise<
  ActionResponse<{
    user: { id: string; email: string; email_confirmed_at: string | null } | null
  }>
> {
  return executeAction(async () => {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return {
      user: user
        ? {
            id: user.id,
            email: user.email!,
            email_confirmed_at: user.email_confirmed_at ?? null,
          }
        : null,
    }
  })
}