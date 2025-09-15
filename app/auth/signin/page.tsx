"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const result = await res.json()

      if (!res.ok || !result.user) {
        setError(
          result.error === "Invalid login credentials"
            ? language === "ar"
              ? "بيانات تسجيل الدخول غير صحيحة"
              : "Invalid login credentials"
            : language === "ar"
              ? "حدث خطأ في تسجيل الدخول"
              : "Login error occurred"
        )
        return
      }

      // حفظ بيانات المستخدم فقط في localStorage (بدون حفظ التوكن)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(result.user))
        // إزالة أي توكن قديم محفوظ سابقاً
        try { localStorage.removeItem("token") } catch {}
      }
      setMessage(language === "ar" ? "تم تسجيل الدخول بنجاح! جاري التوجيه..." : "Login successful! Redirecting...")
      router.push("/dashboard")
    } catch (err) {
      setError(language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Link>

          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            {language === "ar" ? "English" : "عربي"}
          </button>
        </div>

        <Card className="bg-gray-900 border-gray-700 shadow-lg">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-white">
              {language === "ar" ? "تسجيل الدخول" : "Sign In"}
            </CardTitle>
            <p className="text-gray-400 text-base">
              {language === "ar" ? "أدخل بياناتك للوصول إلى حسابك" : "Enter your credentials to access your account"}
            </p>
          </CardHeader>

          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-6 px-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 text-sm font-medium">{message}</p>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-semibold text-base">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  className="bg-gray-800 border-gray-600 text-white px-6 py-4 text-base h-14 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-lg transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-white font-semibold text-base">
                  {language === "ar" ? "كلمة المرور" : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                  className="bg-gray-800 border-gray-600 text-white px-6 py-4 text-base h-14 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-lg transition-all duration-200"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6 px-6 pt-2 pb-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-base font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading
                  ? language === "ar"
                    ? "جاري تسجيل الدخول..."
                    : "Signing in..."
                  : language === "ar"
                    ? "تسجيل الدخول"
                    : "Sign In"}
              </Button>

              <p className="text-center text-gray-400 text-base">
                {language === "ar" ? "ليس لديك حساب؟ " : "Don't have an account? "}
                <Link
                  href="/auth/signup"
                  className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
                >
                  {language === "ar" ? "إنشاء حساب جديد" : "Create new account"}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
