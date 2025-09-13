import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  
  // تحقق من وجود توكن في الهيدر
  const authHeader = req.headers.get("authorization");
  console.log("[API] Wallet balance - Auth header:", authHeader ? "Present" : "Missing");
  
  if (!authHeader) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 401 });
  }
  
  const token = authHeader.replace("Bearer ", "");
  console.log("[API] Wallet balance - Token length:", token.length);
  
  const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!jwtSecret) {
    console.log("[API] Wallet balance - JWT secret not configured");
    return NextResponse.json({ success: false, error: "JWT secret not configured" }, { status: 500 })
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("[API] Wallet balance - Token verified successfully");
  } catch (err) {
    console.log("[API] Wallet balance - Token verification failed:", err.message);
    return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
  }
  try {
    // استخراج user_id من التوكن فقط
    const decoded = jwt.decode(token);
    let user_id = undefined;
    if (typeof decoded === "object" && decoded !== null) {
      user_id = (decoded as any).user_id;
    }
    if (!user_id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: wallet, error } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_id", user_id)
      .single();

    if (error || !wallet) {
      return NextResponse.json({ success: false, error: error?.message || "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, balance: wallet.balance });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
