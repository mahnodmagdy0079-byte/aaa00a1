import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"
import jwt from "jsonwebtoken"

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
    const authHeader = req.headers.get("authorization")
    const cookieToken = req.cookies.get("token")?.value
    const token = authHeader ? authHeader.replace("Bearer ", "") : cookieToken

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token" },
        { status: 401 }
      )
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: "JWT secret not configured" },
        { status: 500 }
      )
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, jwtSecret)
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { toolName } = body

    if (!toolName) {
      return NextResponse.json(
        { success: false, error: "Tool name is required" },
        { status: 400 }
      )
    }

    const userEmail = decoded.user_email
    const userId = decoded.user_id

    if (!userEmail || !userId) {
      return NextResponse.json(
        { success: false, error: "User information not found" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Find available account for the tool
    const { data: availableAccount, error: findError } = await supabase
      .from("tool_accounts")
      .select("*")
      .eq("tool_name", toolName)
      .eq("is_available", true)
      .limit(1)
      .single()

    if (findError || !availableAccount) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No available accounts for this tool. Please try again later." 
        },
        { status: 404 }
      )
    }

    // Assign account to user
    const { data: assignedAccount, error: assignError } = await supabase
      .from("tool_accounts")
      .update({
        is_available: false,
        assigned_to_user: userEmail,
        assigned_at: new Date().toISOString(),
        user_id: userId,
        updated_at: new Date().toISOString()
      })
      .eq("id", availableAccount.id)
      .select()
      .single()

    if (assignError) {
      console.error("Error assigning account:", assignError)
      return NextResponse.json(
        { success: false, error: "Failed to assign account" },
        { status: 500 }
      )
    }

    // Return account credentials (without sensitive info in logs)
    return NextResponse.json({
      success: true,
      account: {
        id: assignedAccount.id,
        username: assignedAccount.account_username,
        password: assignedAccount.account_password,
        email: assignedAccount.account_email,
        tool_name: assignedAccount.tool_name,
        notes: assignedAccount.notes
      }
    })

  } catch (error) {
    console.error("Assign account API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
