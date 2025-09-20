import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  // حماية Rate Limiting
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { 
      device_id, 
      app_version, 
      timestamp, 
      nonce, 
      signature, 
      hardware_info 
    } = await req.json();
    
    if (!device_id) {
      return NextResponse.json({ 
        success: false, 
        error: "Device ID is required" 
      }, { status: 400 });
    }

    // التحقق من التوقيع
    if (!validateRequestSignature(device_id, timestamp, nonce, signature, hardware_info)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request signature" 
      }, { status: 401 });
    }

    // التحقق من timestamp (منع replay attacks)
    if (!validateTimestamp(timestamp)) {
      return NextResponse.json({ 
        success: false, 
        error: "Request timestamp is invalid or expired" 
      }, { status: 401 });
    }

    const supabase = createAdminClient();

    // البحث عن المفتاح الموجود للجهاز
    const { data: existingKey, error: searchError } = await supabase
      .from("device_secret_keys")
      .select("*")
      .eq("device_id", device_id)
      .single();

    if (existingKey && !searchError) {
      // التحقق من انتهاء صلاحية المفتاح
      const now = new Date();
      const keyExpiry = new Date(existingKey.expires_at);
      
      if (now < keyExpiry) {
        // المفتاح لا يزال صالح
        return NextResponse.json({
          success: true,
          secret_key: existingKey.secret_key,
          expires_at: existingKey.expires_at,
          device_id: device_id
        });
      } else {
        // المفتاح منتهي الصلاحية، حذفه وإنشاء جديد
        await supabase
          .from("device_secret_keys")
          .delete()
          .eq("device_id", device_id);
      }
    }

    // إنشاء مفتاح جديد للجهاز
    const newSecretKey = generateSecureKey();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // صالح لمدة 30 يوم

    // حفظ المفتاح في قاعدة البيانات
    const { data: newKey, error: insertError } = await supabase
      .from("device_secret_keys")
      .insert({
        device_id: device_id,
        secret_key: newSecretKey,
        app_version: app_version || "1.0",
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        last_used: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating device key:", insertError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to create device key" 
      }, { status: 500 });
    }

    // إنشاء توقيع للاستجابة
    const responseSignature = createResponseSignature(device_id, newSecretKey, expiresAt.toISOString());

    return NextResponse.json({
      success: true,
      secret_key: newSecretKey,
      expires_at: expiresAt.toISOString(),
      device_id: device_id,
      response_signature: responseSignature,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("Device key error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء إنشاء مفتاح الجهاز" 
    }, { status: 500 });
  }
}

// إنشاء مفتاح آمن
function generateSecureKey(): string {
  // إنشاء مفتاح عشوائي قوي
  const randomBytes = crypto.randomBytes(32);
  return randomBytes.toString('base64');
}

// التحقق من توقيع الطلب
function validateRequestSignature(
  deviceId: string, 
  timestamp: string, 
  nonce: string, 
  signature: string, 
  hardwareInfo: string
): boolean {
  try {
    // إنشاء البيانات الموقعة
    const dataToSign = `${deviceId}_${timestamp}_${nonce}_${hardwareInfo}`;
    
    // استخدام مفتاح سري للتحقق (يجب أن يكون نفس المفتاح المستخدم في البرنامج)
    const secretKey = process.env.TOOLY_SECRET_KEY || "FallbackKey2024";
    
    // إنشاء HMAC
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(dataToSign);
    const expectedSignature = hmac.digest('base64');
    
    // مقارنة التوقيعات
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'base64'),
      Buffer.from(expectedSignature, 'base64')
    );
  } catch (error) {
    console.error("Signature validation error:", error);
    return false;
  }
}

// التحقق من timestamp
function validateTimestamp(timestamp: string): boolean {
  try {
    const requestTime = new Date(timestamp);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - requestTime.getTime());
    
    // الطلب يجب أن يكون حديث (أقل من 5 دقائق)
    return timeDiff < 5 * 60 * 1000;
  } catch (error) {
    console.error("Timestamp validation error:", error);
    return false;
  }
}

// إنشاء توقيع للاستجابة
function createResponseSignature(deviceId: string, secretKey: string, expiresAt: string): string {
  try {
    const dataToSign = `${deviceId}_${secretKey}_${expiresAt}`;
    const serverSecretKey = process.env.SERVER_SECRET_KEY || "ServerSecretKey2024";
    
    const hmac = crypto.createHmac('sha256', serverSecretKey);
    hmac.update(dataToSign);
    return hmac.digest('base64');
  } catch (error) {
    console.error("Response signature creation error:", error);
    return "DefaultResponseSignature";
  }
}

// تحديث آخر استخدام للمفتاح
export async function PUT(req: NextRequest) {
  const rateLimitResponse = rateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { device_id, secret_key } = await req.json();
    
    if (!device_id || !secret_key) {
      return NextResponse.json({ 
        success: false, 
        error: "Device ID and secret key are required" 
      }, { status: 400 });
    }

    const supabase = createAdminClient();

    // تحديث آخر استخدام
    const { error } = await supabase
      .from("device_secret_keys")
      .update({
        last_used: new Date().toISOString()
      })
      .eq("device_id", device_id)
      .eq("secret_key", secret_key);

    if (error) {
      console.error("Error updating device key usage:", error);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to update key usage" 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Key usage updated successfully"
    });

  } catch (err) {
    console.error("Update key usage error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "حدث خطأ أثناء تحديث استخدام المفتاح" 
    }, { status: 500 });
  }
}
