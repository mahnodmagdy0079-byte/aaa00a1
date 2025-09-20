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
    const { toolName, price, durationHours } = await req.json();
    
    if (!toolName || !price || !durationHours) {
      return NextResponse.json({ 
        success: false, 
        error: "Tool name, price, and duration are required" 
      }, { status: 400 });
    }

    const userEmail = decoded.user_email;
    if (!userEmail) {
      return NextResponse.json({ 
        success: false, 
        error: "User email is required" 
      }, { status: 400 });
    }

    const supabase = createAdminClient();

    // فحص الباقة النشطة
    const { data: activeLicense, error: licenseError } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", userEmail)
      .gte("end_date", new Date().toISOString())
      .single();

    const isSubscriptionBased = !!activeLicense && !licenseError;

    // إذا لم تكن الباقة نشطة، فحص المحفظة
    if (!isSubscriptionBased) {
      const { data: wallet, error: walletError } = await supabase
        .from("user_wallets")
        .select("balance")
        .or(`user_id.eq.${decoded.user_id},user_email.eq.${userEmail}`)
        .single();

      if (walletError || !wallet) {
        return NextResponse.json({ 
          success: false, 
          error: "خطأ في الوصول للمحفظة" 
        }, { status: 404 });
      }

      if (wallet.balance < price) {
        return NextResponse.json({
          success: false,
          error: `رصيدك غير كافي لشراء هذه الأداة. تحتاج ${price} جنيه.`,
        }, { status: 400 });
      }

      // خصم من المحفظة
      const { error: deductError } = await supabase
        .from("user_wallets")
        .update({ balance: wallet.balance - price })
        .or(`user_id.eq.${decoded.user_id},user_email.eq.${userEmail}`);

      if (deductError) {
        return NextResponse.json({ 
          success: false, 
          error: "خطأ في خصم المبلغ من المحفظة" 
        }, { status: 500 });
      }
    }

    // إنشاء طلب الأداة
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    const { data: toolRequest, error: requestError } = await supabase
      .from("tool_requests")
      .insert({
        user_email: userEmail,
        user_id: decoded.user_id,
        tool_name: toolName,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price: price,
        duration_hours: durationHours,
        status_ar: "قيد التشغيل",
        purchase_type: isSubscriptionBased ? "subscription" : "credit",
        ultra_id: "", // Empty, waiting for Windows program
        user_name: userEmail.split("@")[0], // Extract username from email
        notes: `Tool purchased ${isSubscriptionBased ? "with subscription" : "with credits"}`,
        requested_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (requestError) {
      return NextResponse.json({ 
        success: false, 
        error: "خطأ في إنشاء طلب الأداة" 
      }, { status: 500 });
    }

    const purchaseType = isSubscriptionBased ? "ضمن الاشتراك" : "شراء بالرصيد";

    return NextResponse.json({
      success: true,
      message: `تم طلب ${toolName} بنجاح! (${purchaseType}) - الأداة نشطة لمدة ${durationHours} ساعة.`,
      toolRequest: {
        id: toolRequest.id,
        start_time: toolRequest.start_time,
        end_time: toolRequest.end_time,
        tool_name: toolName,
        status_ar: "قيد التشغيل",
      },
    });

  } catch (err) {
    console.error("Purchase tool error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء طلب الأداة" 
    }, { status: 500 });
  }
}
