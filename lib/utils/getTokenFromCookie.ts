// Utility to get JWT token from HttpOnly cookie (client-side)
export function getTokenFromCookie() {
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(/(^|;)\s*token=([^;]*)/)
  return match ? decodeURIComponent(match[2]) : ""
}
