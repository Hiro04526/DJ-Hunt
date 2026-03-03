import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // This updates the cookie expiration so the user stays logged in
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|map)).*)',
  ],
}