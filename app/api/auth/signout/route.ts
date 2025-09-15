import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const response = NextResponse.json({ success: true })
  // امسح كوكي التطبيق
  response.cookies.set('token', '', { path: '/', maxAge: 0 })
  // امسح أي كوكيز sb-* إن وُجدت
  const allCookies = req.cookies.getAll()
  for (const c of allCookies) {
    if (c.name.startsWith('sb-') && (c.name.endsWith('-auth-token') || c.name.endsWith('-refresh-token'))) {
      response.cookies.set(c.name, '', { path: '/', maxAge: 0 })
    }
  }
  return response
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}


