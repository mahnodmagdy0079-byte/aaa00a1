import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Try common headers set by proxies/CDNs
  let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""

  if (ip && ip.includes(",")) {
    // Take the first IP in the XFF list
    ip = ip.split(",")[0].trim()
  }

  if (!ip) {
    // Next.js may expose request.ip in some environments
    // @ts-ignore
    ip = (request as any).ip || ""
  }

  // Normalize IPv4-mapped IPv6 addresses
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "")
  }

  // Very rare case: strip port if present
  if (ip && ip.includes(":")) {
    const parts = ip.split(":")
    ip = parts[parts.length - 1]
  }

  return NextResponse.json({ ip: ip || null })
}


