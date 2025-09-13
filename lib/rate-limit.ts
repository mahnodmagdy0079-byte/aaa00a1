import { NextRequest, NextResponse } from 'next/server'

// إعداد القيم الافتراضية للحد
const WINDOW_MS = 60 * 1000 // نافذة زمنية: 60 ثانية
const MAX_REQUESTS = 10 // الحد الأقصى للطلبات لكل IP في النافذة الزمنية
const MAX_REQUESTS_AUTH = 5 // حد أقل لطلبات المصادقة
const MAX_REQUESTS_API = 20 // حد أعلى لطلبات API العادية

// تخزين مؤقت للطلبات لكل IP
const ipRequests: Record<string, { count: number; timestamp: number; authCount: number; authTimestamp: number }> = {}

// تنظيف الطلبات القديمة
function cleanupOldRequests() {
  const now = Date.now()
  Object.keys(ipRequests).forEach(ip => {
    const requests = ipRequests[ip]
    if (now - requests.timestamp > WINDOW_MS) {
      requests.count = 0
      requests.timestamp = now
    }
    if (now - requests.authTimestamp > WINDOW_MS) {
      requests.authCount = 0
      requests.authTimestamp = now
    }
  })
}

export function rateLimit(request: NextRequest, isAuthRequest: boolean = false): NextResponse | undefined {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.ip || 'unknown'
  const now = Date.now()
  const userAgent = request.headers.get('user-agent') || ''

  // تنظيف الطلبات القديمة
  cleanupOldRequests()

  // التحقق من User-Agent المشبوه
  if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent === '') {
    return new NextResponse(
      JSON.stringify({ error: 'Access denied' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // تهيئة الطلبات للـ IP الجديد
  if (!ipRequests[ip]) {
    ipRequests[ip] = { 
      count: 0, 
      timestamp: now, 
      authCount: 0, 
      authTimestamp: now 
    }
  }

  const requests = ipRequests[ip]
  const maxRequests = isAuthRequest ? MAX_REQUESTS_AUTH : MAX_REQUESTS_API

  if (isAuthRequest) {
    // طلبات المصادقة
    if (now - requests.authTimestamp > WINDOW_MS) {
      requests.authCount = 1
      requests.authTimestamp = now
    } else {
      requests.authCount++
      if (requests.authCount > MAX_REQUESTS_AUTH) {
        console.log(`[RATE_LIMIT] Auth requests exceeded for IP: ${ip}`)
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many authentication attempts. Please try again later.',
            retryAfter: Math.ceil((WINDOW_MS - (now - requests.authTimestamp)) / 1000)
          }),
          {
            status: 429,
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((WINDOW_MS - (now - requests.authTimestamp)) / 1000).toString()
            },
          }
        )
      }
    }
  } else {
    // طلبات API العادية
    if (now - requests.timestamp > WINDOW_MS) {
      requests.count = 1
      requests.timestamp = now
    } else {
      requests.count++
      if (requests.count > maxRequests) {
        console.log(`[RATE_LIMIT] API requests exceeded for IP: ${ip}`)
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((WINDOW_MS - (now - requests.timestamp)) / 1000)
          }),
          {
            status: 429,
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((WINDOW_MS - (now - requests.timestamp)) / 1000).toString()
            },
          }
        )
      }
    }
  }

  return undefined
}
