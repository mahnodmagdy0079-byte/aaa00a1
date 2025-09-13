import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // جلب user_email من body مباشرة
  const body = await req.json();
  const user_email = body.user_email;
  if (!user_email) {
    return NextResponse.json({ success: false, error: "User email is required" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data: requests, error } = await supabase
      .from("tool_requests")
      .select("*")
      .eq("user_email", user_email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, requests });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
