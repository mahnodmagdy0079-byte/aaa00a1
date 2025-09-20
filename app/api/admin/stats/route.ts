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

    // التحقق من صلاحيات الإدارة (يمكن إضافة فحص إضافي هنا)
    const userEmail = decoded.user_email;
    if (!userEmail) {
      return NextResponse.json({ 
        success: false, 
        error: "User email is required" 
      }, { status: 400 });
    }

    const supabase = createAdminClient();

    try {
      // جلب عدد المستخدمين الإجمالي
      const { count: totalUsers, error: usersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (usersError) {
        console.error("Users count error:", usersError);
      }

      // جلب عدد الباقات النشطة
      const { count: activeLicenses, error: licensesError } = await supabase
        .from("licenses")
        .select("*", { count: "exact", head: true })
        .gte("end_date", new Date().toISOString());

      if (licensesError) {
        console.error("Licenses count error:", licensesError);
      }

      // جلب عدد طلبات الشراء المعلقة
      const { count: pendingRequests, error: requestsError } = await supabase
        .from("purchase_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (requestsError) {
        console.error("Purchase requests count error:", requestsError);
      }

      // جلب عدد قوائم الهواتف النشطة
      const { count: totalListings, error: listingsError } = await supabase
        .from("phone_listings")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (listingsError) {
        console.error("Phone listings count error:", listingsError);
      }

      const stats = {
        totalUsers: totalUsers || 0,
        activeLicenses: activeLicenses || 0,
        pendingRequests: pendingRequests || 0,
        totalListings: totalListings || 0,
      };

      return NextResponse.json({
        success: true,
        stats,
        error: null
      });

    } catch (error) {
      console.error("Stats fetch error:", error);
      return NextResponse.json({
        success: false,
        stats: { 
          totalUsers: 0, 
          activeLicenses: 0, 
          pendingRequests: 0, 
          totalListings: 0 
        },
        error: "Failed to fetch statistics"
      }, { status: 500 });
    }

  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء جلب الإحصائيات" 
    }, { status: 500 });
  }
}
