import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    // استخراج user_id من التوكن فقط
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!jwtSecret) {
      return NextResponse.json({ valid: false, error: "JWT secret not configured" }, { status: 500 });
    }
    
    let decoded = null;
    let user_email = undefined;
    
    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
      }
    }
    
    // حماية Rate Limiting
    const rateLimitResponse = rateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;
    
    if (typeof decoded === "object" && decoded !== null) {
      user_email = (decoded as any).user_email;
    }
    if (!user_email) {
      return NextResponse.json({ valid: false, error: "User email is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: licenses, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", user_email);

    if (error || !licenses || licenses.length === 0) {
      return NextResponse.json({
        valid: false,
        error: error?.message || "No license found for this email.",
        licenses: licenses || []
      }, { status: 404 });
    }

    // ابحث عن أول باقة غير منتهية
    const now = new Date();
    const validLicense = licenses.find(l => new Date(l.end_date) >= now);
    if (!validLicense) {
      return NextResponse.json({
        valid: false,
        error: "All licenses expired for this email.",
        licenses
      }, { status: 403 });
    }

    return NextResponse.json({ valid: true, license: validLicense, licenses });
  } catch (err) {
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 });
  }
}
