"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function ToolsPage() {
  const [language, setLanguage] = useState<"ar" | "en">("ar")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPlan, setUserPlan] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // Added auth loading state

  useEffect(() => {
    checkAuthStatus() // Enhanced auth check
  }, [])

  const checkAuthStatus = async () => {
    try {
      // First check localStorage for license-based auth
      const savedLicense = localStorage.getItem("userLicense")
      const savedPlan = localStorage.getItem("userPlan")

      if (savedLicense && savedPlan) {
        // Verify the license is still valid
        const supabase = createClient()
        if (!supabase) {
          console.log("[v0] Supabase client not available")
          return
        }
        const { data, error } = await supabase
          .from("licenses")
          .select("*")
          .eq("license_key", savedLicense.trim())
          .single()

        if (data && !error) {
          const expiryDate = new Date(data.end_date)
          const now = new Date()

          if (expiryDate > now) {
            setIsLoggedIn(true)
            setUserPlan(savedPlan)
            setAuthLoading(false)
            return
          } else {
            // License expired, clear localStorage
            localStorage.removeItem("userLicense")
            localStorage.removeItem("userPlan")
          }
        }
      }

      // Check Supabase authentication
      const supabase = createClient()
      if (!supabase) {
        console.log("[v0] Supabase client not available")
        return
      }
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // User is authenticated with Supabase, check for active license
        const { data: licenseData } = await supabase
          .from("licenses")
          .select("*")
          .eq("user_id", user.id)
          .gte("end_date", new Date().toISOString())
          .order("end_date", { ascending: false })
          .limit(1)
          .single()

        if (licenseData) {
          setIsLoggedIn(true)
          setUserPlan(licenseData.package_name)
          // Update localStorage for faster future checks
          localStorage.setItem("userLicense", licenseData.license_key)
          localStorage.setItem("userPlan", licenseData.package_name)
        }
      }
    } catch (error) {
      console.log("[v0] Auth check error:", error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userLicense")
    localStorage.removeItem("userPlan")
    setIsLoggedIn(false)
    setUserPlan("")
  }

  const content = {
    ar: {
      title: "الأدوات المتوفرة",
      subtitle: "اختر الأداة المناسبة لاحتياجاتك",
      backToHome: "العودة للرئيسية",
      price: "السعر",
      duration: "المدة",
      hours: "ساعات",
      hour: "ساعة",
      egp: "جنيه",
      getAccess: "احصل على الوصول",
      nav: {
        home: "الرئيسية",
        packages: "الباقات",
        services: "خدمات",
      },
      tools: [
        {
          name: "UNLOCK TOOL",
          price: "40",
          duration: "6 ساعات",
          type: "share",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlocktool-NPHtho1CAQGcQHKCNF6xxWGzTPvRkS.png",
          description: "أداة فتح الأجهزة المحمولة",
        },
        {
          name: "AMT",
          price: "10",
          duration: "6 ساعات",
          type: "no-credit",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amt%20tool-vbZwFqmow6hmLB9T8NycS6F1L9aT3T.png",
          description: "أداة إدارة الأجهزة المتقدمة - من غير كريدت",
        },
        {
          name: "TSM TOOL",
          price: "70",
          duration: "24 ساعة",
          type: "share",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tsm-nuVd1KpatoAvPdDUZ6Jk9myjKO69P2.png",
          description: "أداة إدارة النظام التقنية",
        },
        {
          name: "CF TOOL",
          price: "70",
          duration: "24 ساعة",
          type: "share",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CF-Tool-logo-4fWDOa32L480YscXSWQ4PTGDTpmUWy.png",
          description: "أداة الفلاشة والإصلاح",
        },
        {
          name: "TFM TOOL",
          price: "50",
          duration: "24 ساعة",
          type: "share",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TFM-TOOL-xOkieC4R23uDNcaBCD4ZThBl1iixQY.png",
          description: "أداة إدارة الملفات التقنية",
        },
        {
          name: "Cheetah TOOL",
          price: "50",
          duration: "24 ساعة",
          type: "share",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah-TOOL-jXJ3EgPZTbIaG9YCbT0DhuBHxihU8f.png",
          description: "أداة سريعة للإصلاح",
        },
        {
          name: "Global Unlocker Pro",
          price: "10",
          duration: "6 ساعات",
          type: "no-credit",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/global-unlucker-pro-aVsW6X3q8Gdd3rXk7r1dNxsFCTTSZy.png",
          description: "أداة فتح الأجهزة العالمية - من غير كريدت",
        },
      ],
    },
    en: {
      title: "Available Tools",
      subtitle: "Choose the right tool for your needs",
      backToHome: "Back to Home",
      price: "Price",
      duration: "Duration",
      hours: "hours",
      hour: "hour",
      egp: "EGP",
      getAccess: "Get Access",
      nav: {
        home: "Home",
        packages: "Packages",
        services: "Services",
      },
      tools: [
        {
          name: "UNLOCK TOOL",
          price: "40",
          duration: "6 hours",
          type: "share",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlocktool-NPHtho1CAQGcQHKCNF6xxWGzTPvRkS.png",
          description: "Mobile device unlocking tool",
        },
        {
          name: "AMT",
          price: "10",
          duration: "6 hours",
          type: "no-credit",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amt%20tool-vbZwFqmow6hmLB9T8NycS6F1L9aT3T.png",
          description: "Advanced device management tool - no credit",
        },
        {
          name: "TSM TOOL",
          price: "70",
          duration: "24 hours",
          type: "share",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tsm-nuVd1KpatoAvPdDUZ6Jk9myjKO69P2.png",
          description: "Technical system management tool",
        },
        {
          name: "CF TOOL",
          price: "70",
          duration: "24 hours",
          type: "share",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CF-Tool-logo-4fWDOa32L480YscXSWQ4PTGDTpmUWy.png",
          description: "Flashing and repair tool",
        },
        {
          name: "TFM TOOL",
          price: "50",
          duration: "24 hours",
          type: "share",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TFM-TOOL-xOkieC4R23uDNcaBCD4ZThBl1iixQY.png",
          description: "Technical file management tool",
        },
        {
          name: "Cheetah TOOL",
          price: "50",
          duration: "24 hours",
          type: "share",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah-TOOL-jXJ3EgPZTbIaG9YCbT0DhuBHxihU8f.png",
          description: "Fast repair tool",
        },
        {
          name: "Global Unlocker Pro",
          price: "10",
          duration: "6 hours",
          type: "no-credit",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/global-unlucker-pro-aVsW6X3q8Gdd3rXk7r1dNxsFCTTSZy.png",
          description: "Global device unlocking tool - no credit",
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-black text-white" dir={language === "ar" ? "rtl" : "ltr"}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Auth buttons */}
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
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    size="sm"
                    variant="outline"
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-base"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => (window.location.href = "/auth/signup")}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-4 py-2 text-base"
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/auth/signin")}
                    size="sm"
                    variant="outline"
                    className="hover:bg-orange-500 hover:text-white backdrop-blur-sm rounded-lg px-4 py-2 text-base text-white bg-transparent border-transparent"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Group all navigation items in one rounded container */}
            <div className="hidden md:flex items-center">
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 flex items-center gap-1">
                <span className="text-orange-400 font-medium text-base px-4 py-2 rounded-full bg-orange-500/10">
                  {currentContent.nav.services}
                </span>
                <a
                  href="/packages"
                  className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10"
                >
                  {currentContent.nav.packages}
                </a>
                <a
                  href="/"
                  className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10"
                >
                  {currentContent.nav.home}
                </a>
              </div>
            </div>

            {/* Right side - Logo and Language */}
            <div className="flex items-center gap-4">
              <Image
                src="/tooly-gsm-logo-new.png"
                alt="TOOLY GSM Logo"
                width={32}
                height={16}
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
              />

              {/* Language Switcher */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 border border-orange-500/20">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
                      language === "en" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("ar")}
                    className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
                      language === "ar" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    عربي
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-orange-500 transition-colors duration-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-orange-500/20 py-6">
              <div className="flex flex-col space-y-4 px-4">
                <a
                  href="/"
                  className="text-white hover:text-orange-400 transition-colors duration-300 font-medium py-2 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentContent.nav.home}
                </a>
                <a
                  href="/packages"
                  className="text-white hover:text-orange-400 transition-colors duration-300 font-medium py-2 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentContent.nav.packages}
                </a>
                <span className="text-orange-400 font-medium py-2 text-base">{currentContent.nav.services}</span>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-orange-500/20">
                  {authLoading ? (
                    <div className="flex flex-col gap-3">
                      <div className="w-full h-10 bg-gray-700 animate-pulse rounded-lg"></div>
                      <div className="w-full h-10 bg-gray-700 animate-pulse rounded-lg"></div>
                    </div>
                  ) : isLoggedIn ? (
                    <>
                      <Button
                        onClick={() => {
                          window.location.href = "/dashboard"
                          setIsMobileMenuOpen(false)
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-lg px-4 py-2 text-base"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        size="sm"
                        variant="outline"
                        className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white bg-transparent rounded-lg"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          window.location.href = "/auth/signup"
                          setIsMobileMenuOpen(false)
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-4 py-2 text-base"
                      >
                        Sign Up
                      </Button>
                      <Button
                        onClick={() => {
                          window.location.href = "/auth/signin"
                          setIsMobileMenuOpen(false)
                        }}
                        size="sm"
                        variant="outline"
                        className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white bg-transparent rounded-lg"
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors mb-6"
            >
              <ArrowLeft className={`w-4 h-4 ${language === "ar" ? "rotate-180 ml-2" : "mr-2"}`} />
              {currentContent.backToHome}
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              {currentContent.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">{currentContent.subtitle}</p>
          </div>

          {/* Tools Grid Display - Public for everyone */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContent.tools.map((tool, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-4 rounded-xl bg-gray-800 p-3 group-hover:bg-gray-700 transition-colors">
                      <Image
                        src={tool.image || "/placeholder.svg"}
                        alt={tool.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{tool.description}</p>

                    <div className="flex flex-col gap-2 mb-4 w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">{currentContent.price}:</span>
                        <span className="text-orange-500 font-bold">
                          {tool.price} {currentContent.egp}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">{currentContent.duration}:</span>
                        <span className="text-white">{tool.duration}</span>
                      </div>
                      {tool.type === "no-credit" && (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-2 mt-2">
                          <span className="text-blue-300 text-xs">من غير كريدت</span>
                        </div>
                      )}
                    </div>

                    <Link href="/auth/signin" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-300">
                        {currentContent.getAccess}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
