import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // استخراج التوكن
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("token")?.value;
    const token = authHeader ? authHeader.replace("Bearer ", "") : cookieToken;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
    }

    // التحقق من صحة التوكن
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

    // استخراج البيانات من الطلب
    const { toolRequestId, successfulAccount, automationSuccess } = await req.json();
    
    if (!toolRequestId || !successfulAccount) {
      return NextResponse.json({ 
        success: false, 
        error: "Tool request ID and successful account are required" 
      }, { status: 400 });
    }

    const userEmail = decoded.user_email;
    const userId = decoded.user_id || decoded.sub;
    
    if (!userEmail) {
      return NextResponse.json({ 
        success: false, 
        error: "User email is required" 
      }, { status: 400 });
    }

    const supabase = createAdminClient();

    // التحقق من أن الطلب يخص المستخدم
    const { data: toolRequest, error: requestError } = await supabase
      .from("tool_requests")
      .select("*")
      .eq("id", toolRequestId)
      .eq("user_email", userEmail)
      .single();

    if (requestError || !toolRequest) {
      return NextResponse.json({ 
        success: false, 
        error: "Tool request not found or access denied" 
      }, { status: 404 });
    }

    // تحديث حالة الطلب إلى Done وحفظ الحساب الناجح
    const { data: updatedRequest, error: updateError } = await supabase
      .from("tool_requests")
      .update({
        status_ar: automationSuccess ? "Done" : "فشل في الأوتوميشن",
        shared_email: successfulAccount.email || successfulAccount.username,
        ultra_id: successfulAccount.username,
        password: successfulAccount.password,
        notes: automationSuccess 
          ? `تم بنجاح - Account: ${successfulAccount.username}` 
          : `فشل في الأوتوميشن - Account: ${successfulAccount.username}`,
        updated_at: new Date().toISOString()
      })
      .eq("id", toolRequestId)
      .select()
      .single();

    if (updateError) {
      console.error("Tool request update error:", updateError);
      return NextResponse.json({ 
        success: false, 
        error: `خطأ في تحديث حالة الطلب: ${updateError.message}` 
      }, { status: 500 });
    }

    // إذا نجح الأوتوميشن، تحديث الحساب في tool_accounts ليصبح غير متاح
    if (automationSuccess && successfulAccount.account_id) {
      await supabase
        .from("tool_accounts")
        .update({
          is_available: false,
          assigned_to_user: userId,
          assigned_at: new Date().toISOString(),
          user_id: userId,
          updated_at: new Date().toISOString()
        })
        .eq("id", successfulAccount.account_id);
    }

    console.log(`Tool request ${toolRequestId} updated successfully. Automation success: ${automationSuccess}`);

    return NextResponse.json({
      success: true,
      message: automationSuccess 
        ? "تم تسجيل نجاح الأوتوميشن بنجاح!" 
        : "تم تسجيل فشل الأوتوميشن",
      toolRequest: {
        id: updatedRequest.id,
        status_ar: updatedRequest.status_ar,
        shared_email: updatedRequest.shared_email,
        ultra_id: updatedRequest.ultra_id
      }
    });

  } catch (err) {
    console.error("Update automation status error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء تحديث حالة الأوتوميشن" 
    }, { status: 500 });
  }
}
