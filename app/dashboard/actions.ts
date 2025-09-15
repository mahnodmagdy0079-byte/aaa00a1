"use server"
import { createClient } from "@/lib/supabase/server"

export async function purchaseToolAction(toolName: string, userEmail: string, price: number, durationHours: number) {
  try {
    const supabase = await createClient()

    // Check if user has active subscription (license)
    const { data: activeLicense, error: licenseError } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", userEmail)
      .gte("end_date", new Date().toISOString())
      .single()

    const isSubscriptionBased = !!activeLicense && !licenseError

    // If not subscription-based, check wallet balance and deduct
    if (!isSubscriptionBased) {
      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_email", userEmail)
        .single()

      if (walletError || !wallet) {
        return { success: false, message: "خطأ في الوصول للمحفظة" }
      }

      if (wallet.balance < price) {
        return {
          success: false,
          message: `رصيدك غير كافي لشراء هذه الأداة. تحتاج ${price} جنيه.`,
        }
      }

      // Deduct from wallet
      const { error: deductError } = await supabase
        .from("wallets")
        .update({ balance: wallet.balance - price })
        .eq("user_email", userEmail)

      if (deductError) {
        return { success: false, message: "خطأ في خصم المبلغ من المحفظة" }
      }
    }

    // Create tool request
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000)

    const { data: toolRequest, error: requestError } = await supabase
      .from("tool_requests")
      .insert({
        user_email: userEmail,
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
      .single()

    if (requestError) {

      return { success: false, message: "خطأ في إنشاء طلب الأداة" }
    }

    const purchaseType = isSubscriptionBased ? "ضمن الاشتراك" : "شراء بالرصيد"

    return {
      success: true,
      message: `تم طلب ${toolName} بنجاح! (${purchaseType}) - الأداة نشطة لمدة ${durationHours} ساعة.`,
      toolRequest: {
        id: toolRequest.id,
        start_time: toolRequest.start_time,
        end_time: toolRequest.end_time,
        tool_name: toolName,
        status_ar: "قيد التشغيل",
      },
    }
  } catch (error) {

    return { success: false, message: "حدث خطأ أثناء طلب الأداة" }
  }
}

export async function getActiveToolRequestsAction(userEmail: string) {
  try {
    const supabase = await createClient()

    // Update expired requests first
    await updateExpiredToolRequestsAction()

    // Get active tool requests
    const { data: toolRequests, error } = await supabase
      .from("tool_requests")
      .select("*")
      .eq("user_email", userEmail)
      .gte("end_time", new Date().toISOString())
      .order("created_at", { ascending: false })

    if (error) {

      return { success: false, toolRequests: [] }
    }

    return { success: true, toolRequests: toolRequests || [] }
  } catch (error) {

    return { success: false, toolRequests: [] }
  }
}

export async function getToolsAction() {
  try {
    const supabase = await createClient()
    const { data: tools, error } = await supabase.from("tools").select("*").order("name")
    if (error) {
      return { success: false, tools: [] }
    }
    return { success: true, tools: tools || [] }
  } catch (error) {
    return { success: false, tools: [] }
  }
}

export async function getPhoneListingsAction() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("phone_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
    if (error) {
      return { success: false, listings: [] }
    }
    return { success: true, listings: data || [] }
  } catch (error) {
    return { success: false, listings: [] }
  }
}

export async function createPhoneListingAction(payload: {
  user_id: string
  user_name: string
  phone_model: string
  problem_type: string
  description: string
  budget?: string
  location?: string
}) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("phone_listings").insert(payload)
    if (error) {
      return { success: false, message: "خطأ أثناء إنشاء الطلب" }
    }
    return { success: true, message: "تم نشر طلبك بنجاح" }
  } catch (error) {
    return { success: false, message: "حدث خطأ غير متوقع" }
  }
}

export async function signOutAction() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    // تنظيف أي كوكيز sb-* قد تكون موجودة
    // لا يمكننا تعديل كوكيز من هنا مباشرة بدون NextResponse،
    // لذا يُفضّل إنشاء API /api/auth/signout لمسح الكوكيز أيضاً إن لزم
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function updateExpiredToolRequestsAction() {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("tool_requests")
      .update({ status_ar: "Done" })
      .lt("end_time", new Date().toISOString())
      .eq("status_ar", "قيد التشغيل")

    if (error) {

      return { success: false }
    }

    return { success: true }
  } catch (error) {

    return { success: false }
  }
}

export async function updateSharedEmailAction(requestId: string, sharedEmail: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("tool_requests").update({ ultra_id: sharedEmail }).eq("id", requestId)

    if (error) {

      return { success: false, message: "خطأ في تحديث الإيميل المشارك" }
    }

    return { success: true, message: "تم تحديث الإيميل المشارك بنجاح" }
  } catch (error) {

    return { success: false, message: "حدث خطأ أثناء تحديث الإيميل" }
  }
}

export async function getUserSubscriptionStatusAction(userEmail: string) {
  try {
    const supabase = await createClient()

    const { data: activeLicense, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", userEmail)
      .gte("end_date", new Date().toISOString())
      .single()

    return {
      success: true,
      hasActiveSubscription: !!activeLicense && !error,
      license: activeLicense,
    }
  } catch (error) {

    return { success: false, hasActiveSubscription: false, license: null }
  }
}
