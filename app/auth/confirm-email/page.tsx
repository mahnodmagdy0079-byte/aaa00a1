"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const content = {
    ar: {
      title: "تم إنشاء الحساب بنجاح!",
      subtitle: "تحقق من بريدك الإلكتروني",
      message: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني",
      emailLabel: "البريد الإلكتروني:",
      instruction: "يرجى فتح بريدك الإلكتروني والضغط على رابط التأكيد لتفعيل حسابك",
      checkEmail: "تحقق من البريد الإلكتروني",
      backToSignIn: "العودة لتسجيل الدخول",
      resendEmail: "إعادة إرسال الرسالة"
    },
    en: {
      title: "Account Created Successfully!",
      subtitle: "Check Your Email",
      message: "A confirmation email has been sent to your email address",
      emailLabel: "Email Address:",
      instruction: "Please check your email and click the confirmation link to activate your account",
      checkEmail: "Check Email",
      backToSignIn: "Back to Sign In",
      resendEmail: "Resend Email"
    },
  }

  const currentContent = content[language]

  const handleResendEmail = async () => {
    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      
      if (res.ok) {
        alert(language === "ar" ? "تم إعادة إرسال الرسالة" : "Email resent successfully")
      }
    } catch (error) {
      console.error("Error resending email:", error)
    }
  }

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
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{currentContent.title}</h1>
            <p className="text-slate-400 mb-4">{currentContent.subtitle}</p>
            <p className="text-green-400 text-sm">{currentContent.message}</p>
          </div>

          {/* Email Display */}
          {email && (
            <div className="mb-6 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
              <p className="text-slate-300 text-sm mb-1">{currentContent.emailLabel}</p>
              <p className="text-orange-400 font-medium">{email}</p>
            </div>
          )}

          {/* Instruction */}
          <div className="mb-8">
            <p className="text-slate-300 text-sm leading-relaxed">{currentContent.instruction}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {currentContent.resendEmail}
            </button>

            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-slate-700/50 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {currentContent.backToSignIn}
            </button>
          </div>

          {/* Email Icon */}
          <div className="mt-8">
            <div className="w-12 h-12 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
