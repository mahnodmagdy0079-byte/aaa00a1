import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import jwt from "jsonwebtoken"
import { createClient } from "@/lib/supabase/server"
import { addSecurityHeaders, addCORSHeaders } from "@/lib/security-headers"

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  // حماية Rate Limiting للمصادقة
  const rateLimitResponse = rateLimit(req, true);
  if (rateLimitResponse) return rateLimitResponse;
    // تحقق من وجود توكن في الهيدر
    const authHeader = req.headers.get("authorization")
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "")
      try {
        const decoded = jwt.verify(token, process.env.SUPABASE_SERVICE_ROLE_KEY || "secret")
        // يمكن هنا إضافة تحقق إضافي من صلاحيات المستخدم إذا لزم الأمر
      } catch (err) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }
    }
  try {

    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

  const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "Invalid credentials" }, { status: 401 })
    }

    // إصدار JWT للمستخدم بعد نجاح تسجيل الدخول
    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!jwtSecret) {
      return NextResponse.json({ error: "JWT secret not configured" }, { status: 500 })
    }

    const token = jwt.sign(
      {
        user_id: data.user.id,
        user_email: data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    )

    // إرسال التوكن في HttpOnly Cookie وإرجاعه في الـ response
    const response = NextResponse.json({ user: data.user, token })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // أسبوع
    })
    // إزالة أي كوكيز مصادقة تابعة لـ Supabase في المتصفح
    const allCookies = req.cookies.getAll()
    for (const c of allCookies) {
      if (c.name.startsWith('sb-') && c.name.endsWith('-auth-token')) {
        response.cookies.set(c.name, '', { path: '/', maxAge: 0 })
      }
      if (c.name.startsWith('sb-') && c.name.endsWith('-refresh-token')) {
        response.cookies.set(c.name, '', { path: '/', maxAge: 0 })
      }
    }
    
    // إضافة رؤوس الأمان
    const origin = req.headers.get('origin')
    return addCORSHeaders(addSecurityHeaders(response), origin || undefined)
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
