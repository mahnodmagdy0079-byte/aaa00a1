"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Key, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LicensePage() {
  const [licenseKey, setLicenseKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<any>(null)

  const router = useRouter()

  // جلب التوكن من localStorage كما كان سابقاً
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    // تحقق من وجود مستخدم في localStorage فقط (لا تعتمد على التوكن)
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/signin")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    console.log("[FRONT] handleLicenseSubmit تم استدعاؤها")
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() })
      })
      const result = await res.json()

      if (!res.ok || !result.valid) {
        setError(result.error || "الترخيص غير صحيح أو منتهي الصلاحية")
        return
      }

      const licenseData = result.license
      localStorage.setItem(
        "userLicense",
        JSON.stringify({
          licenseKey: licenseData.license_key,
          packageName: licenseData.package_name,
          packagePrice: licenseData.package_price,
          endDate: licenseData.end_date,
          startDate: licenseData.start_date,
          userName: licenseData.user_name,
          userPhone: licenseData.phone_number,
        }),
      )

      setMessage("تم التحقق من الترخيص بنجاح! جاري التوجيه...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      setError("حدث خطأ في التحقق من الترخيص")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة لتسجيل الدخول
          </Link>
        </div>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl text-white">تفعيل الترخيص</CardTitle>
            <p className="text-gray-400">أدخل كود الترخيص الخاص بك للوصول إلى لوحة التحكم</p>
          </CardHeader>

          <form onSubmit={handleLicenseSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                  <Key className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">{message}</p>
                </div>
              )}

              <div>
                <Label htmlFor="licenseKey" className="text-white text-lg mb-3 block">
                  كود الترخيص
                </Label>
                <Input
                  id="licenseKey"
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="مثال: E6Q6-SENO-KHVO-OTOC"
                  className="bg-gray-800 border-gray-600 text-white text-center text-lg font-mono tracking-wider h-14"
                  required
                />
                <p className="text-gray-500 text-xs mt-2 text-center">أدخل كود الترخيص المكون من 19 حرف ورقم</p>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading || !licenseKey.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري التحقق...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    تفعيل الترخيص
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            ليس لديك ترخيص؟{" "}
            <Link href="/packages" className="text-orange-500 hover:text-orange-400 transition-colors">
              اشترك في إحدى الباقات
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
