import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req);
  if (rl) return rl;

  try {
    // Auth (require admin JWT)
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("token")?.value;
    const token = authHeader ? authHeader.replace("Bearer ", "") : cookieToken;
    if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });

    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!jwtSecret) return NextResponse.json({ success: false, error: "JWT secret not configured" }, { status: 500 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    if (!decoded?.is_admin && decoded?.role !== 'admin') {
      // Simple admin check; adapt to your claims structure
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const minSupportedVersion = (body.minSupportedVersion as string | undefined)?.trim();
    const forceUpdate = !!body.forceUpdate;
    const downloadUrl = (body.downloadUrl as string | undefined)?.trim() || "";
    const message = (body.message as string | undefined)?.trim() || "";

    if (!minSupportedVersion) {
      return NextResponse.json({ success: false, error: "minSupportedVersion is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    // Deactivate previous active rows
    await supabase.from("app_config").update({ is_active: false }).eq("is_active", true);

    // Insert new row
    const { data, error } = await supabase
      .from("app_config")
      .insert({
        min_supported_version: minSupportedVersion,
        force_update: forceUpdate,
        download_url: downloadUrl,
        message,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Internal error" }, { status: 500 });
  }
}


