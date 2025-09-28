import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Send confirmation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      console.error("Error resending confirmation email:", error)
      return NextResponse.json(
        { error: "Failed to resend confirmation email" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Confirmation email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in resend confirmation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
