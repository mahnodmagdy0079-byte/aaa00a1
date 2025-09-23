import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest) {
  try {
    const resp = await fetch("https://ipinfo.io/json", { cache: "no-store" })
    if (!resp.ok) {
      return NextResponse.json({ ip: null }, { status: 200 })
    }
    const data = await resp.json()
    return NextResponse.json({ ip: data?.ip ?? null })
  } catch {
    return NextResponse.json({ ip: null }, { status: 200 })
  }
}


