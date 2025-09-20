import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(req)
    if (rateLimitResult) {
      return rateLimitResult
    }

    // Get user from JWT token
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get active license
    const { data: activeLicense, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_email", user.email)
      .gte("end_date", new Date().toISOString())
      .single()

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
      console.error("Error fetching subscription status:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch subscription status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hasActiveSubscription: !!activeLicense,
      license: activeLicense || null
    })

  } catch (error) {
    console.error("Subscription status API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
