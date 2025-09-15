import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // تحقق من الجلسة باستخدام JWT الخاص بنا من Cookie 'token' فقط
  const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  const token = request.cookies.get('token')?.value

  // Allow access to home page, auth pages, admin, packages, and tools without redirect
  const allowedPaths = ["/", "/auth", "/admin", "/packages", "/tools"]
  const isAllowedPath = allowedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  if (!isAllowedPath) {
    let isAuthenticated = false
    if (token && jwtSecret) {
      try {
        jwt.verify(token, jwtSecret)
        isAuthenticated = true
      } catch {}
    }
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/signin"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
