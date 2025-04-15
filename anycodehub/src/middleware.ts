import { NextResponse, NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = [
  '/profile',
  '/settings',
  '/courses/create',
  '/admin',
  // Add more paths that need authentication
]

// Paths that should redirect to home if already authenticated
const authPaths = [
  '/auth',
  '/sign-in',
  '/sign-up',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the path is in authPaths or starts with one of them
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  // Check if the path is in protectedPaths or starts with one of them
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  // Get the authentication cookie status
  const hasAccessToken = request.cookies.has('X-ACCESS-TOKEN')
  
  // For auth paths, redirect to home if already logged in
  if (isAuthPath && hasAccessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // For protected paths, redirect to login if not logged in
  if (isProtectedPath && !hasAccessToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // Continue to the requested page
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Include API routes
    '/(api|trpc)(.*)',
  ],
}