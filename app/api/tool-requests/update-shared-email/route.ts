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

    // Parse request body
    const body = await req.json()
    const { requestId, sharedEmail } = body

    // Input validation
    if (!requestId || !sharedEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sharedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Update shared email
    const { error } = await supabase
      .from("tool_requests")
      .update({ ultra_id: sharedEmail })
      .eq("id", requestId)
      .eq("user_email", user.email) // Ensure user can only update their own requests

    if (error) {
      console.error("Error updating shared email:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update shared email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث الإيميل المشارك بنجاح"
    })

  } catch (error) {
    console.error("Update shared email API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
