import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Admin routes: only allow users with role = admin
    if (req.nextUrl.pathname.startsWith('/admin') &&
        !req.nextUrl.pathname.startsWith('/admin/login')) {
      const token = req.nextauth.token
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin/login')) return true
        if (req.nextUrl.pathname.startsWith('/admin')) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
