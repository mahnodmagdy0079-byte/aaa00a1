import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const supabase = createAdminClient();
    
    // جلب جميع الأدوات
    const { data: tools, error } = await supabase
      .from("tools")
      .select("*")
      .order("name");

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tools: tools || []
    });

  } catch (err) {
    console.error("Get tools error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء جلب الأدوات" 
    }, { status: 500 });
  }
}
