// Security Headers Configuration
// إعدادات رؤوس الأمان

import { NextResponse } from 'next/server'

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // منع XSS
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  )
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )
  
  // Strict Transport Security (HTTPS only)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  
  // Cache Control for sensitive data
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  return response
}

export function addCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  // CORS Configuration - Allow all origins for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
  } else {
    // Development - only allow localhost
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else {
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    }
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

export function createSecureResponse(data: any, status: number = 200, origin?: string): NextResponse {
  const response = NextResponse.json(data, { status })
  return addCORSHeaders(addSecurityHeaders(response), origin)
}
