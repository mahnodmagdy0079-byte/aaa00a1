import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    // طباعة في التيرمنال عند استقبال أي طلب
    console.log("[API] تم استقبال طلب تحقق ترخيص عبر /api/license")
    const { licenseKey } = await req.json()
    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json({ error: "License key is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("license_key", licenseKey.trim())
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false, error: error?.message || "License not found" }, { status: 404 })
    }

    // تحقق من تاريخ الانتهاء
    const expiryDate = new Date(data.end_date)
    const now = new Date()
    if (expiryDate < now) {
      return NextResponse.json({ valid: false, error: "License expired" }, { status: 403 })
    }

    return NextResponse.json({ valid: true, license: data })
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
