
import { NextResponse, NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value
 
  // Check if the user is trying to access the sign-in page
  if (request.nextUrl.pathname === '/sign-in') {
    return NextResponse.next()
  }
 
  // If there's no token, redirect to sign-in
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
 
  try {
    // You might want to add token validation logic here
    // For example, checking if it's expired using JWT
    return NextResponse.next()
  } catch (error) {
    // If token is invalid or expired, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}
 
// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in (to prevent redirect loop)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)',
  ],
}
