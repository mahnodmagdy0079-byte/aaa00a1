import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const rate = rateLimit(req);
  if (rate) return rate;

  try {
    const supabase = createAdminClient();
    const nowIso = new Date().toISOString();

    // Find expired requests
    const { data: expired, error: findErr } = await supabase
      .from("tool_requests")
      .select("id, ultra_id")
      .lt("end_time", nowIso)
      .neq("status", "expired");

    if (findErr) {
      return NextResponse.json({ success: false, error: findErr.message }, { status: 500 });
    }

    if (expired && expired.length > 0) {
      const ids = expired.map(r => r.id);
      // Mark requests as expired
      await supabase
        .from("tool_requests")
        .update({ status: "expired", status_ar: "منتهي" })
        .in("id", ids);

      // Free accounts for which ultra_id is known
      const usernames = expired.map(r => r.ultra_id).filter(Boolean);
      if (usernames.length > 0) {
        await supabase
          .from("tool_accounts")
          .update({ is_available: true, assigned_to_user: null, user_id: null })
          .in("account_username", usernames as string[]);
      }
    }

    return NextResponse.json({ success: true, expired: (expired || []).length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}


