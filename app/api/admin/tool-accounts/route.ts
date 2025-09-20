import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { rateLimit } from "@/lib/rate-limit"
import jwt from "jsonwebtoken"

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

    // Check if user is admin (you can add admin role check here)
    const supabase = createAdminClient()

    // Get all tool accounts
    const { data: accounts, error } = await supabase
      .from("tool_accounts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tool accounts:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch tool accounts" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      accounts: accounts || []
    })

  } catch (error) {
    console.error("Tool accounts API error:", error)
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
    const { tool_name, account_username, account_password, account_email, notes } = body

    // Input validation
    if (!tool_name || !account_username || !account_password) {
      return NextResponse.json(
        { success: false, error: "Tool name, username, and password are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Create new tool account
    const { data: newAccount, error } = await supabase
      .from("tool_accounts")
      .insert({
        tool_name,
        account_username,
        account_password,
        account_email: account_email || null,
        notes: notes || null,
        is_available: true,
        assigned_to_user: null,
        assigned_at: null,
        user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating tool account:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create tool account" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      account: newAccount
    })

  } catch (error) {
    console.error("Create tool account API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
