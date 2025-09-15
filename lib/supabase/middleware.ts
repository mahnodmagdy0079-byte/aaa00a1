import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // إزالة أي كوكيز Supabase قديمة sb-*-auth-token / sb-*-refresh-token
  const incomingCookies = request.cookies.getAll()
  for (const c of incomingCookies) {
    if (c.name.startsWith('sb-') && (c.name.endsWith('-auth-token') || c.name.endsWith('-refresh-token'))) {
      supabaseResponse.cookies.set(c.name, '', { path: '/', maxAge: 0 })
    }
  }

  // تحقق من الجلسة باستخدام JWT الخاص بنا من Cookie 'token' فقط
  const token = request.cookies.get('token')?.value

  // Allow access to home page, auth pages, admin, packages, and tools without redirect
  const allowedPaths = ["/", "/auth", "/admin", "/packages", "/tools"]
  const isAllowedPath = allowedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
  )

  if (!isAllowedPath) {
    // لا نتحقق من التوقيع هنا لأن الميدلوير يعمل على Edge وقد لا تتوفر المتغيرات السرية
    // يكفي وجود الكوكي لتمرير المستخدم إلى الصفحة، بينما يتم التحقق القوي داخل الـ API/السيرفر
    const isAuthenticated = Boolean(token)
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/signin"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
