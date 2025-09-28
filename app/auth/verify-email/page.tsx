"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    
    if (token && email) {
      verifyEmail(token, email)
    } else {
      setError(language === "ar" ? "رابط غير صحيح" : "Invalid link")
      setIsVerifying(false)
    }
  }, [searchParams, language])

  const verifyEmail = async (token: string, email: string) => {
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email })
      })
      
      const result = await res.json()
      
      if (res.ok && result.success) {
        setIsSuccess(true)
        // Redirect to signin page after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin")
        }, 3000)
      } else {
        setError(result.error || (language === "ar" ? "فشل في تأكيد البريد الإلكتروني" : "Email verification failed"))
      }
    } catch (error) {
      setError(language === "ar" ? "حدث خطأ في تأكيد البريد الإلكتروني" : "Error verifying email")
    } finally {
      setIsVerifying(false)
    }
  }

  const content = {
    ar: {
      title: "تأكيد البريد الإلكتروني",
      verifying: "جاري تأكيد البريد الإلكتروني...",
      success: "تم تأكيد البريد الإلكتروني بنجاح!",
      successMessage: "تم تفعيل حسابك بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول",
      error: "خطأ في التأكيد",
      backToSignIn: "العودة لتسجيل الدخول",
      redirecting: "جاري التوجيه..."
    },
    en: {
      title: "Email Verification",
      verifying: "Verifying email...",
      success: "Email verified successfully!",
      successMessage: "Your account has been activated successfully. You will be redirected to the sign in page",
      error: "Verification Error",
      backToSignIn: "Back to Sign In",
      redirecting: "Redirecting..."
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
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">{currentContent.title}</h1>
          </div>

          {isVerifying && (
            <div className="space-y-6">
              {/* Loading Spinner */}
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-300">{currentContent.verifying}</p>
            </div>
          )}

          {isSuccess && (
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-green-400 font-semibold text-lg mb-2">{currentContent.success}</p>
                <p className="text-slate-300 text-sm mb-4">{currentContent.successMessage}</p>
                <p className="text-orange-400 text-sm">{currentContent.redirecting}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-red-400 font-semibold text-lg mb-2">{currentContent.error}</p>
                <p className="text-slate-300 text-sm mb-6">{error}</p>
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  {currentContent.backToSignIn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
