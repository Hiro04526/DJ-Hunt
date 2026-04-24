import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only run this logic for /admin and its sub-paths
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value
    let isValidSession = false

    // Try to verify the token if it exists
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET)
        await jwtVerify(token, secret)
        isValidSession = true
      } catch (error) {
        isValidSession = false
      }
    }

    // 1. If they are logged in and hit /admin/login (or just /admin), skip to the dashboard
    if ((pathname === '/admin/login' || pathname === '/admin') && isValidSession) {
      return NextResponse.redirect(new URL('/admin/hitlist', request.url))
    }

    // 2. If they are logged out and hit any protected route (like /admin/hitlist or /admin), send to login
    if (pathname !== '/admin/login' && !isValidSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 3. Otherwise, let them proceed normally
    return NextResponse.next()
  }

  // Allow all public traffic to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}