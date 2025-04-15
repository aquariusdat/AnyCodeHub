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
  
  // Get the authentication token from cookies
  const accessToken = request.cookies.get('X-ACCESS-TOKEN')
  
  // Kiểm tra xem token có tồn tại và còn hiệu lực không
  const hasValidToken = !!accessToken && !isTokenExpired(accessToken.value)
  
  // For auth paths, redirect to home if already logged in with valid token
  if (isAuthPath && hasValidToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // For protected paths, redirect to login if not logged in or token invalid
  if (isProtectedPath && !hasValidToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // Continue to the requested page
  return NextResponse.next()
}

// Hàm kiểm tra token đã hết hạn chưa
function isTokenExpired(token: string): boolean {
  try {
    // JWT có 3 phần: header, payload, signature, phân cách bởi dấu .
    const payload = token.split('.')[1]
    if (!payload) return true
    
    // Giải mã phần payload từ base64
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    
    // Lấy thời gian hết hạn (exp) từ payload, đơn vị là timestamp (giây)
    const exp = decoded.exp
    if (!exp) return true
    
    // So sánh với thời gian hiện tại (đơn vị millisecond)
    const currentTime = Math.floor(Date.now() / 1000)
    
    return currentTime >= exp
  } catch (error) {
    console.error('Error checking token expiry:', error)
    return true // Nếu có lỗi, coi như token đã hết hạn
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Include API routes
    '/(api|trpc)(.*)',
  ],
}