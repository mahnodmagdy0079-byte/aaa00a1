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

    // البحث عن حساب متاح للأداة (اختياري)
    let assignedAccount = null;
    console.log(`Searching for tool: "${toolName}"`);
    
    // البحث عن حساب متاح للأداة (اختياري تماماً)
    try {
      console.log(`Looking for accounts with tool_name: "${toolName}"`);
      
      const { data: availableAccounts, error: accountError } = await supabase
        .from("tool_accounts")
        .select("*")
        .eq("tool_name", toolName)
        .eq("is_available", true)
        .limit(1);

      console.log(`Query result:`, { availableAccounts, accountError });

      const availableAccount = availableAccounts && availableAccounts.length > 0 ? availableAccounts[0] : null;
      console.log(`Available account found:`, availableAccount);

      if (!accountError && availableAccount) {
        // تخصيص الحساب للمستخدم
        const { data: assignedAccountData, error: assignError } = await supabase
          .from("tool_accounts")
          .update({
            is_available: false,
            assigned_to_user: userEmail,
            assigned_at: new Date().toISOString(),
            user_id: decoded.user_id,
            updated_at: new Date().toISOString()
          })
          .eq("id", availableAccount.id)
          .select()
          .single();

        if (!assignError && assignedAccountData) {
          assignedAccount = assignedAccountData;
          console.log(`Account assigned: ${assignedAccount.account_username}`);
        } else {
          console.log("Failed to assign account:", assignError);
        }
      } else {
        console.log("No available accounts found for tool:", toolName);
        console.log("Continuing without account assignment...");
      }
    } catch (error) {
      console.log("Error in account assignment process:", error);
      console.log("Continuing without account assignment...");
      // لا نوقف العملية إذا فشل تخصيص الحساب
    }

    // إنشاء طلب الأداة
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    console.log("Creating tool request with data:", {
      user_email: userEmail,
      user_id: decoded.user_id,
      tool_name: toolName,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      price: price,
      duration_hours: durationHours,
      status_ar: "قيد التشغيل",
      purchase_type: isSubscriptionBased ? "subscription" : "credit",
      ultra_id: assignedAccount ? assignedAccount.account_username : "",
      user_name: userEmail.split("@")[0],
      notes: `Tool purchased ${isSubscriptionBased ? "with subscription" : "with credits"}${assignedAccount ? ` - Account: ${assignedAccount.account_username}` : ""}`,
      requested_at: new Date().toISOString(),
    });

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
        ultra_id: assignedAccount ? assignedAccount.account_username : "", // Username of assigned account
        user_name: userEmail.split("@")[0], // Extract username from email
        notes: `Tool purchased ${isSubscriptionBased ? "with subscription" : "with credits"}${assignedAccount ? ` - Account: ${assignedAccount.account_username}` : ""}`,
        requested_at: new Date().toISOString(),
        is_subscription_based: isSubscriptionBased,
        shared_email: null, // Will be filled by Windows program
        wallet_transaction_id: null // Will be filled if needed
      })
      .select()
      .single();

    if (requestError) {
      console.error("Tool request creation error:", requestError);
      return NextResponse.json({ 
        success: false, 
        error: `خطأ في إنشاء طلب الأداة: ${requestError.message}` 
      }, { status: 500 });
    }

    const purchaseType = isSubscriptionBased ? "ضمن الاشتراك" : "شراء بالرصيد";

    console.log(`Purchase successful for tool: ${toolName}`);
    console.log(`Account assigned:`, assignedAccount ? "Yes" : "No");

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
      account: assignedAccount ? {
        username: assignedAccount.account_username,
        password: assignedAccount.account_password,
        email: assignedAccount.account_email,
        account_id: assignedAccount.id
      } : null
    });

  } catch (err) {
    console.error("Purchase tool error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء طلب الأداة" 
    }, { status: 500 });
  }
}
