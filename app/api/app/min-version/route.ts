import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const rl = rateLimit(req);
  if (rl) return rl;
  try {
    const supabase = createAdminClient();
    // Single-row config or latest active
    const { data, error } = await supabase
      .from("app_config")
      .select("min_supported_version, force_update, download_url, message, is_active")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({
        success: true,
        minSupportedVersion: "1.0.0",
        forceUpdate: true,
        downloadUrl: "https://your-site/downloads/ToolyGSM-Setup-1.0.0.exe",
        message: "يرجى التحديث إلى الإصدار 1.0.0",
      });
    }

    return NextResponse.json({
      success: true,
      minSupportedVersion: data?.min_supported_version || "1.0.0",
      forceUpdate: data?.force_update ?? true,
      downloadUrl: data?.download_url || "https://your-site/downloads/ToolyGSM-Setup-1.0.0.exe",
      message: data?.message || "يرجى التحديث إلى الإصدار 1.0.0",
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      minSupportedVersion: "1.0.0",
      forceUpdate: true,
      downloadUrl: "https://your-site/downloads/ToolyGSM-Setup-1.0.0.exe",
      message: "يرجى التحديث إلى الإصدار 1.0.0",
    });
  }
}


