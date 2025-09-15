import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";
import { 
  validateDeviceId, 
  validateToolType, 
  validateTabletModel, 
  validateNotes,
  sanitizeString 
} from "@/lib/validation";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  // قراءة التوكن من Authorization أو من الكوكيز HttpOnly
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("token")?.value;
  const token = authHeader ? authHeader.replace("Bearer ", "") : cookieToken;
  if (!token) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }
  const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!jwtSecret) {
    return NextResponse.json({ success: false, error: "JWT secret not configured" }, { status: 500 })
  }
  
  try {
    jwt.verify(token, jwtSecret);
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
  }
  try {
    const body = await req.json();
    
    // استخراج user_id من التوكن فقط
    const decoded = jwt.decode(token);
    let user_id = undefined;
    if (typeof decoded === "object" && decoded !== null) {
      user_id = (decoded as any).user_id;
    }
    
    if (!user_id) {
      return NextResponse.json({ success: false, error: "User ID not found in token" }, { status: 400 });
    }

    // التحقق من صحة المدخلات
    const deviceIdValidation = validateDeviceId(body.device_id);
    if (!deviceIdValidation.isValid) {
      return NextResponse.json({ success: false, error: deviceIdValidation.errors.join(", ") }, { status: 400 });
    }

    const toolTypeValidation = validateToolType(body.tool_type);
    if (!toolTypeValidation.isValid) {
      return NextResponse.json({ success: false, error: toolTypeValidation.errors.join(", ") }, { status: 400 });
    }

    const tabletModelValidation = validateTabletModel(body.tablet_model || "");
    if (!tabletModelValidation.isValid) {
      return NextResponse.json({ success: false, error: tabletModelValidation.errors.join(", ") }, { status: 400 });
    }

    const notesValidation = validateNotes(body.notes || "");
    if (!notesValidation.isValid) {
      return NextResponse.json({ success: false, error: notesValidation.errors.join(", ") }, { status: 400 });
    }

    // تنظيف المدخلات
    const sanitizedData = {
      user_id,
      user_name: sanitizeString(body.user_name || ""),
      device_id: sanitizeString(body.device_id),
      password: sanitizeString(body.password || ""),
      tool_type: sanitizeString(body.tool_type),
      tablet_model: sanitizeString(body.tablet_model || ""),
      notes: sanitizeString(body.notes || ""),
      license_key: sanitizeString(body.license_key || ""),
      package_name: sanitizeString(body.package_name || ""),
    };

    const supabase = createAdminClient();
    const { error } = await supabase.from("tool_requests").insert(sanitizedData);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
