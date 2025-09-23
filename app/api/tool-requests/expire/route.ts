import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const rate = rateLimit(req);
  if (rate) return rate;

  try {
    const supabase = createAdminClient();
    const nowIso = new Date().toISOString();

    // Find requests whose end_time already passed (regardless of current status)
    const { data: expired, error: findErr } = await supabase
      .from("tool_requests")
      .select("id, ultra_id")
      .lt("end_time", nowIso)
      .order("end_time", { ascending: false });

    if (findErr) {
      return NextResponse.json({ success: false, error: findErr.message }, { status: 500 });
    }

    if (expired && expired.length > 0) {
      const ids = expired.map(r => r.id);
      // Mark requests as expired
      const { error: updErr } = await supabase
        .from("tool_requests")
        .update({ status: "expired", status_ar: "منتهي" })
        .in("id", ids);

      if (updErr) {
        return NextResponse.json({ success: false, error: updErr.message }, { status: 500 });
      }

      // Free accounts for which ultra_id is known
      const usernames = expired.map(r => r.ultra_id).filter(Boolean);
      if (usernames.length > 0) {
        await supabase
          .from("tool_accounts")
          .update({ is_available: true, assigned_to_user: null, user_id: null })
          .in("account_username", usernames as string[]);
      }
    }

    // Safety pass: free any accounts that are assigned but have no active requests
    try {
      const { data: inUse, error: scanErr } = await supabase
        .from("tool_accounts")
        .select("account_username, is_available, assigned_to_user")
        .neq("assigned_to_user", null);

      if (!scanErr && inUse && inUse.length > 0) {
        const usernames = inUse.map(a => a.account_username).filter(Boolean) as string[];
        if (usernames.length > 0) {
          const nowIso2 = new Date().toISOString();
          const { data: stillActive, error: activeErr } = await supabase
            .from("tool_requests")
            .select("ultra_id")
            .in("ultra_id", usernames)
            .gte("end_time", nowIso2);

          const activeSet = new Set((stillActive || []).map(r => r.ultra_id));
          const toFree = usernames.filter(u => !activeSet.has(u));
          if (toFree.length > 0) {
            await supabase
              .from("tool_accounts")
              .update({ is_available: true, assigned_to_user: null, user_id: null })
              .in("account_username", toFree);
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return NextResponse.json({ success: true, expired: (expired || []).length, ids: (expired || []).map(r => r.id) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}


