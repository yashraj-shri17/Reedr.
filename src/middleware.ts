import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Simplify middleware logic for mock mode
  // If the Supabase URL contains 'placeholder', it means we are in a mock environment
  // or a development setup where Supabase is not fully configured.
  // In this case, we bypass authentication checks and allow access to all routes.
  if (url?.includes('placeholder')) {
    // For mock mode, we can simply allow all requests to proceed without auth checks.
    // If there's a specific redirect needed for auth routes in mock mode, it can be added here.
    // For now, we'll just let all requests pass through.
    return NextResponse.next()
  }

  const supabase = createServerClient(
    url!,
    anonKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes: (main) group
  // We check if the pathname starts with a route that should be protected.
  // In our structure, (main) routes include /shelf, /search, /settings, /pricing
  const protectedRoutes = ['/shelf', '/search', '/settings', '/pricing']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access /login or /signup, redirect to /shelf
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/shelf'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
