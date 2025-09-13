import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ewkzduhofisinbhjrzzu.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a3pkdWhvZmlzaW5iaGpyenp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzE3OTYsImV4cCI6MjA3MTMwNzc5Nn0.k_xa-C5jYCiCQ3KK6Xj4hyyfLIR1uWXeOZ0RQB8KUwI"

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    return null
  }
}

// Additional functions or configurations can be added here if needed
