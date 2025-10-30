import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  // IMPORTANT: Handle auth code exchange FIRST (for email confirmation, OAuth, etc.)
  const code = request.nextUrl.searchParams.get('code')
  
  console.log('Middleware - URL:', request.nextUrl.href)
  console.log('Middleware - Code detected:', code ? 'YES' : 'NO')
  
  if (code) {
    console.log('Middleware - Exchanging code for session...')
    
    // Create a redirect response to dashboard with code removed
    const url = request.nextUrl.clone()
    url.searchParams.delete('code')
    url.pathname = '/dashboard'
    
    const redirectResponse = NextResponse.redirect(url)
    
    // Create Supabase client with redirect response cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      },
    )
    
    // Exchange code for session and set cookies on redirect
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Middleware - Error exchanging code:', error)
    } else {
      console.log('Middleware - Code exchange successful, redirecting to dashboard')
    }
    
    return redirectResponse
  }

  // Normal request handling
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  )

  // Refresh session if expired
  await supabase.auth.getSession()

  const protectedRoutes = ['/dashboard', '/events', '/profile']
  const authRoutes = ['/login', '/signup']
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
