"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const { language, setLanguage } = useLanguage()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError(language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError(
        language === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters",
      )
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      const result = await res.json()

      if (!res.ok || !result.user) {
        setError(
          result.error === "Registration error"
            ? language === "ar"
              ? "حدث خطأ في التسجيل. حاول مرة أخرى"
              : "Registration error. Please try again"
            : language === "ar"
              ? "حدث خطأ غير متوقع"
              : "Unexpected error occurred"
        )
        return
      }

      if (result.user) {
        setSuccess(
          language === "ar"
            ? "تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب"
            : "Account created successfully! Check your email to confirm your account",
        )

        // Redirect to signin page after successful signup
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      }
    } catch (err) {

      setError(language === "ar" ? "حدث خطأ في التسجيل. حاول مرة أخرى" : "Registration error. Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const content = {
    ar: {
      title: "إنشاء حساب جديد",
      subtitle: "أدخل بياناتك لإنشاء حساب جديد",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      signUp: "إنشاء حساب",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      loading: "جاري الإنشاء...",
    },
    en: {
      title: "Create New Account",
      subtitle: "Enter your details to create a new account",
      name: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      signUp: "Sign Up",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      loading: "Creating...",
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Language Toggle */}
      <button
        onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
        className="fixed top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {language === "ar" ? "English" : "عربي"}
      </button>

      {/* Back to Home */}
      <a
        href="/"
        className="fixed top-4 right-4 text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
      >
        <span>{language === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>

      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{currentContent.title}</h1>
            <p className="text-slate-400">{currentContent.subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">{currentContent.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{currentContent.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{currentContent.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{currentContent.confirmPassword}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {isLoading ? currentContent.loading : currentContent.signUp}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              {currentContent.haveAccount}{" "}
              <a href="/auth/signin" className="text-orange-400 hover:text-orange-300 font-medium">
                {currentContent.signIn}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
