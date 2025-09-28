"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function SiteNav() {
  const { language, setLanguage } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const savedLicense = localStorage.getItem("userLicense")
      const savedPlan = localStorage.getItem("userPlan")
      if (savedLicense && savedPlan) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userLicense")
    localStorage.removeItem("userPlan")
    setIsLoggedIn(false)
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-orange-500/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Auth buttons and Language */}
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {authLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-20 h-8 bg-gray-700 animate-pulse rounded-lg"></div>
                <div className="w-24 h-8 bg-gray-700 animate-pulse rounded-lg"></div>
              </div>
            ) : isLoggedIn ? (
              <>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-lg px-4 py-2 text-base"
                >
                  {language === "ar" ? "لوحة التحكم" : "Dashboard"}
                </Button>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="outline"
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-base"
                >
                  {language === "ar" ? "تسجيل الخروج" : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => (window.location.href = "/auth/signup")}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-4 py-2 text-base"
                >
                  {language === "ar" ? "إنشاء حساب" : "Sign Up"}
                </Button>
                <Button
                  onClick={() => (window.location.href = "/auth/signin")}
                  size="sm"
                  variant="outline"
                  className="hover:bg-orange-500 hover:text-white backdrop-blur-sm rounded-lg px-4 py-2 text-base text-white bg-transparent border-transparent"
                >
                  {language === "ar" ? "تسجيل الدخول" : "Sign In"}
                </Button>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 border border-orange-500/20">
            <div className="flex items-center gap-1">
              <button onClick={() => setLanguage("en")} className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${language === "en" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}>English</button>
              <button onClick={() => setLanguage("ar")} className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${language === "ar" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}>عربي</button>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <div className="hidden md:flex items-center" style={{ marginLeft: '1.5cm' }}>
          <div className="bg-black/60 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 flex items-center gap-1">
            <Link 
              href="/" 
              className={`transition-all duration-300 font-medium text-base px-4 py-2 rounded-full ${
                isActive("/") 
                  ? "text-orange-400 bg-orange-500/20" 
                  : "text-white hover:text-orange-300 hover:bg-orange-500/10"
              }`}
            >
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <Link 
              href="/packages" 
              className={`transition-all duration-300 font-medium text-base px-4 py-2 rounded-full ${
                isActive("/packages") 
                  ? "text-orange-400 bg-orange-500/20" 
                  : "text-white hover:text-orange-300 hover:bg-orange-500/10"
              }`}
            >
              {language === "ar" ? "الباقات" : "Packages"}
            </Link>
            <Link 
              href="/tools" 
              className={`transition-all duration-300 font-medium text-base px-4 py-2 rounded-full ${
                isActive("/tools") 
                  ? "text-orange-400 bg-orange-500/20" 
                  : "text-white hover:text-orange-300 hover:bg-orange-500/10"
              }`}
            >
              {language === "ar" ? "الأسعار" : "Pricing"}
            </Link>
            <Link 
              href="/downloads" 
              className={`transition-all duration-300 font-medium text-base px-4 py-2 rounded-full ${
                isActive("/downloads") 
                  ? "text-orange-400 bg-orange-500/20" 
                  : "text-white hover:text-orange-300 hover:bg-orange-500/10"
              }`}
            >
              {language === "ar" ? "التحميل" : "Downloads"}
            </Link>
            <Link 
              href="/supported-models" 
              className={`transition-all duration-300 font-medium text-base px-4 py-2 rounded-full ${
                isActive("/supported-models") 
                  ? "text-orange-400 bg-orange-500/20" 
                  : "text-white hover:text-orange-300 hover:bg-orange-500/10"
              }`}
            >
              {language === "ar" ? "الموديلات المدعومة" : "Supported Models"}
            </Link>
          </div>
        </div>

        {/* Right side - Logo */}
        <div className="flex items-center gap-4">
          <Image src="/tooly-gsm-logo-new.png" alt="TOOLY GSM Logo" width={32} height={16} />
        </div>
      </div>
    </nav>
  )
}


