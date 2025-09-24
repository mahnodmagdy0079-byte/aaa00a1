import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  // Rate limit
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Auth
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

    // Body
    const body = await req.json();
    const toolRequestId = body.toolRequestId as string | undefined;
    const toolName = (body.toolName as string | undefined)?.trim();
    const limit = Math.min(Math.max(parseInt(body.limit) || 3, 1), 10);

    if (!toolName) {
      return NextResponse.json({ success: false, error: "Tool name is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1) Try to fetch currently available accounts for this tool
    const { data: available, error: availErr } = await supabase
      .from("tool_accounts")
      .select("id, account_username, account_password, account_email")
      .eq("tool_name", toolName)
      .eq("is_available", true)
      .limit(limit);

    if (!availErr && available && available.length > 0) {
      return NextResponse.json({
        success: true,
        accounts: available.map(a => ({
          username: a.account_username,
          password: a.account_password,
          email: a.account_email,
          account_id: a.id,
        }))
      });
    }

    // 2) No available accounts → compute nearest availability from active requests' end_time
    const nowIso = new Date().toISOString();
    const { data: busyReqs, error: busyErr } = await supabase
      .from("tool_requests")
      .select("ultra_id, end_time")
      .eq("tool_name", toolName)
      .gte("end_time", nowIso);

    if (busyErr) {
      return NextResponse.json({ success: false, error: "Failed to query busy accounts" }, { status: 500 });
    }

    let nextAvailableAt: string | null = null;
    let accountsBusy: Array<{ username: string; end_time: string }> = [];
    if (busyReqs && busyReqs.length > 0) {
      for (const r of busyReqs) {
        if (r.ultra_id && r.end_time) {
          accountsBusy.push({ username: r.ultra_id, end_time: r.end_time });
          if (!nextAvailableAt || new Date(r.end_time) < new Date(nextAvailableAt)) {
            nextAvailableAt = r.end_time;
          }
        }
      }
    }

    if (!nextAvailableAt) {
      return NextResponse.json({
        success: false,
        error: "No available accounts",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      error: "All accounts are currently in use",
      nextAvailableAt,
      accountsBusy,
    }, { status: 200 });

  } catch (err) {
    console.error("next-account error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}


