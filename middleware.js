import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const publicRoutes = ['/', '/auth']
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname) || 
                       req.nextUrl.pathname.startsWith('/interview/')
  
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
  
  if (session && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}