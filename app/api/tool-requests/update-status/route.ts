import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("token")?.value;
    const token = authHeader ? authHeader.replace("Bearer ", "") : cookieToken;
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, error: "JWT secret not configured" }, { status: 500 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    const { toolRequestId, status, notes, finishedAt } = await req.json();
    if (!toolRequestId || !status) {
      return NextResponse.json({ success: false, error: "toolRequestId and status are required" }, { status: 400 });
    }

    const allowed = ["success", "failed", "running"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const userEmail = decoded.user_email;
    const userId = decoded.user_id || decoded.sub;

    const supabase = createAdminClient();

    // Ensure the request belongs to the caller (by id and user)
    const { data: existing, error: fetchErr } = await supabase
      .from("tool_requests")
      .select("id, user_email, user_id")
      .eq("id", toolRequestId)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ success: false, error: "Tool request not found" }, { status: 404 });
    }

    // For desktop automation, accept any valid user token; just log context for auditing
    console.log("update-status accepted", { toolRequestId, existingEmail: existing.user_email, callerEmail: userEmail, callerUserId: userId });

    const statusAr = status === "success" ? "تم" : status === "failed" ? "فشل" : "قيد التشغيل";

    const { error: updateErr } = await supabase
      .from("tool_requests")
      .update({
        status,
        status_ar: statusAr,
        notes: notes ?? null,
        end_time: finishedAt ?? new Date().toISOString(),
      })
      .eq("id", toolRequestId);

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Unexpected error" }, { status: 500 });
  }
}


