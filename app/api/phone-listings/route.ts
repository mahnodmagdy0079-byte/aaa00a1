import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 })
}

export async function GET(req: NextRequest) {
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

    // Get phone listings
    const { data: listings, error } = await supabase
      .from("phone_listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching phone listings:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch phone listings" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      listings: listings || []
    })

  } catch (error) {
    console.error("Phone listings API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
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
    const { phone_model, problem_type, description, budget, location } = body

    // Input validation
    if (!phone_model || !problem_type || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create phone listing
    const payload = {
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      phone_model,
      problem_type,
      description,
      budget: budget || null,
      location: location || null,
      status: "active",
      created_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from("phone_listings")
      .insert(payload)

    if (error) {
      console.error("Error creating phone listing:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create phone listing" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "تم نشر طلبك بنجاح"
    })

  } catch (error) {
    console.error("Create phone listing API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
