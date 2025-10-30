import {
  signInAction,
  signInWithGoogleAction,
  signOutAction,
  signUpAction,
  getCurrentUserAction,
} from '@/lib/actions/auth'

import { createServerSupabaseClient } from '@/lib/supabase/server'

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(),
}))

const mockedCreateServer = createServerSupabaseClient

function makeSupabaseMock(overrides = {}) {
  return {
    auth: {
      signUp: jest.fn().mockResolvedValue({ error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: jest
        .fn()
        .mockResolvedValue({ data: { url: 'https://example.com' }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-1', email: 'user@example.com', email_confirmed_at: null } },
      }),
    },
    ...overrides,
  }
}

describe('auth server actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('signUpAction returns success on valid sign up', async () => {
    const supabase = makeSupabaseMock()
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signUpAction('a@example.com', 'Password123!')

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'a@example.com',
      password: 'Password123!',
    })
    expect(res).toEqual({ success: true, data: { message: expect.any(String) } })
  })

  it('signUpAction returns error when supabase returns error', async () => {
    const supabase = makeSupabaseMock()
    supabase.auth.signUp.mockResolvedValueOnce({ error: { message: 'Email in use' } })
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signUpAction('a@example.com', 'Password123!')
    expect(res).toEqual({ success: false, error: 'Email in use' })
  })

  it('signInAction returns success on valid credentials', async () => {
    const supabase = makeSupabaseMock()
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signInAction('a@example.com', 'Password123!')

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'a@example.com',
      password: 'Password123!',
    })
    expect(res).toEqual({ success: true, data: { message: 'Signed in successfully' } })
  })

  it('signInAction returns error when credentials invalid', async () => {
    const supabase = makeSupabaseMock()
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid login' },
    })
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signInAction('a@example.com', 'wrong')
    expect(res).toEqual({ success: false, error: 'Invalid login' })
  })

  it('signInWithGoogleAction returns OAuth URL', async () => {
    const supabase = makeSupabaseMock()
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signInWithGoogleAction()
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled()
    expect(res).toEqual({ success: true, data: { url: expect.stringContaining('http') } })
  })

  it('signInWithGoogleAction returns error when OAuth fails', async () => {
    const supabase = makeSupabaseMock()
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({
      data: {},
      error: { message: 'OAuth error' },
    })
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signInWithGoogleAction()
    expect(res).toEqual({ success: false, error: 'OAuth error' })
  })

  it('signInWithGoogleAction returns error when no URL returned', async () => {
    const supabase = makeSupabaseMock()
    supabase.auth.signInWithOAuth.mockResolvedValueOnce({ data: {}, error: null })
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signInWithGoogleAction()
    expect(res).toEqual({ success: false, error: 'No OAuth URL returned' })
  })

  it('signOutAction returns success when sign out works', async () => {
    const supabase = makeSupabaseMock()
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signOutAction()
    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(res).toEqual({ success: true, data: { message: 'Signed out successfully' } })
  })

  it('signOutAction returns error when sign out fails', async () => {
    const supabase = makeSupabaseMock()
    supabase.auth.signOut.mockResolvedValueOnce({ error: { message: 'Sign out failed' } })
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await signOutAction()
    expect(res).toEqual({ success: false, error: 'Sign out failed' })
  })

  it('getCurrentUserAction returns sanitized user', async () => {
    const supabase = makeSupabaseMock()
    mockedCreateServer.mockResolvedValue(supabase)

    const res = await getCurrentUserAction()
    expect(supabase.auth.getUser).toHaveBeenCalled()
    expect(res).toEqual({
      success: true,
      data: {
        user: {
          id: 'user-1',
          email: 'user@example.com',
          email_confirmed_at: null,
        },
      },
    })
  })
})