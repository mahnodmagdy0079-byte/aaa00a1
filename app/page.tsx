"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Smartphone, Users, Clock, DollarSign, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/LanguageContext"

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const { language, setLanguage } = useLanguage()
  const [showLogin, setShowLogin] = useState(false)
  const [license, setLicense] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPlan, setUserPlan] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // Added auth loading state

  useEffect(() => {
    setIsVisible(true)
    checkAuthStatus() // Check both localStorage and Supabase auth
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

    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    try {
      const supabase = createClient()
      if (!supabase) {
        setLoginError(language === "ar" ? "خطأ في الاتصال" : "Connection error")
        return
      }



      const { data, error } = await supabase.from("licenses").select("*").eq("license_key", license.trim()).single()



      if (error) {

        setLoginError(language === "ar" ? "الترخيص غير صحيح أو منتهي الصلاحية" : "Invalid or expired license")
        return
      }

      if (!data) {

        setLoginError(language === "ar" ? "الترخيص غير صحيح أو منتهي الصلاحية" : "Invalid or expired license")
        return
      }

      const expiryDate = new Date(data.end_date)
      const now = new Date()



      if (expiryDate < now) {
        setLoginError(language === "ar" ? "الترخيص منتهي الصلاحية" : "License has expired")
        return
      }

      localStorage.setItem("userLicense", license)
      localStorage.setItem("userPlan", data.package_name)
      setIsLoggedIn(true)
      setUserPlan(data.package_name)
      setShowLogin(false)
      setLicense("")

      window.location.href = "/dashboard"


    } catch (error) {

      setLoginError(language === "ar" ? "حدث خطأ أثناء تسجيل الدخول" : "An error occurred during login")
    } finally {
      setIsLoading(false)
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
      title: "إصلح تليفونك في أسرع وقت وأرخص سعر",
      subtitle: "بدل ما تكلم فني واحد، اعرض تليفونك وأكتر من فني يديك سعره... وانت اللي تختار",
      currency: "جنيه",
      features: [
        "أمان كامل: فلوسك محمية لحد ما الخدمة تتم",
        "جودة مضمونة: كل الفنيين متجربين ومتقييماتهم واضحة",
        "سرعة في التنفيذ: تشوف الوقت المتوقع من كل فني",
      ],
      popular: "الأكثر طلباً",
      howItWorks: "كيف تشتغل المنصة (ببساطة)",
      platformSteps: [
        {
          step: "1",
          title: "اكتب نوع جهازك والمشكلة",
          desc: "Format، IMEI Check، Unlock وغيرها من المشاكل",
        },
        {
          step: "2",
          title: "استلم عروض أسعار وسرعة التنفيذ",
          desc: "من فنيين موثوقين ومتجربين",
        },
        {
          step: "3",
          title: "اختر العرض الأنسب ليك",
          desc: "قارن الأسعار والأوقات واختار الأفضل",
        },
        {
          step: "4",
          title: "ادفع بأمان واستلم خدمتك بسرعة",
          desc: "فلوسك بتكون محمية لحد ما الخدمة تتم بنجاح",
        },
      ],
      whyUs: "ليه تختارنا؟",
      whyUsDesc: "منصة آمنة وموثوقة تجمع أفضل الفنيين في مكان واحد",
      ctaTitle: "جاهز تبدأ طلبك؟",
      ctaDesc: "انضم لآلاف العملاء اللي وثقوا فينا واحصل على أفضل خدمة إصلاح هواتف",
      ctaButton: "ابدأ طلبك الآن",
      contactBtn: "تواصل معنا الآن",
      consultBtn: "اطلب استشارة مجانية",
      copyright: "© 2025 TOOLY GSM. جميع الحقوق محفوظة.",
      signInBtn: "تسجيل الدخول",
      signUpBtn: "إنشاء حساب",
      nav: {
        home: "الرئيسية",
        packages: "الباقات",
        services: "خدمات",
      },
      plans: [
        {
          name: "الباقة الصغيرة",
          price: "100",
          period: "أسبوعياً",
          description: "مثالية للمبتدئين والاستخدام المحدود",
          buttonText: "اختر الصغيرة",
        },
        {
          name: "الباقة المتوسطة",
          price: "400",
          period: "شهرياً",
          description: "الأفضل للفنيين والمحلات التجارية",
          buttonText: "اختر المتوسطة",
        },
        {
          name: "الباقة الكبيرة",
          price: "600",
          period: "شهرياً",
          description: "للمحترفين والشركات الكبيرة",
          buttonText: "اختر الكبيرة",
        },
      ],
      whyFeatures: [
        {
          title: "أمان كامل",
          desc: "فلوسك بتكون محمية لحد ما الخدمة تتم بنجاح",
          icon: Shield,
        },
        {
          title: "جودة مضمونة",
          desc: "كل الفنيين عندنا متجربين ومتقييماتهم واضحة",
          icon: Users,
        },
        {
          title: "سرعة في التنفيذ",
          desc: "بتشوف الوقت المتوقع من كل فني وتختار اللي يناسبك",
          icon: Clock,
        },
        {
          title: "أسعار تنافسية",
          desc: "الفنيين بيتنافسوا علشان إنت تختار الأفضل",
          icon: DollarSign,
        },
      ],
    },
    en: {
      title: "Fix Your Phone Faster and Cheaper",
      subtitle: "Instead of calling one technician, post your phone and get multiple price quotes... you choose",
      currency: "$",
      features: [
        "Complete Security: Your money is protected until service completion",
        "Guaranteed Quality: All technicians are tested with clear ratings",
        "Fast Execution: See expected time from each technician",
      ],
      popular: "Most Popular",
      howItWorks: "How the Platform Works (Simply)",
      platformSteps: [
        {
          step: "1",
          title: "Write your device type and problem",
          desc: "Format, IMEI Check, Unlock and other issues",
        },
        {
          step: "2",
          title: "Receive price quotes and execution speed",
          desc: "From trusted and experienced technicians",
        },
        {
          step: "3",
          title: "Choose the best offer for you",
          desc: "Compare prices and times and choose the best",
        },
        {
          step: "4",
          title: "Pay securely and receive your service quickly",
          desc: "Your money is protected until service is successfully completed",
        },
      ],
      whyUs: "Why Choose Us?",
      whyUsDesc: "A secure and reliable platform that brings together the best technicians in one place",
      ctaTitle: "Ready to Start Your Request?",
      ctaDesc: "Join thousands of customers who trusted us and get the best phone repair service",
      ctaButton: "Start Your Request Now",
      contactBtn: "Contact Us Now",
      consultBtn: "Request Free Consultation",
      copyright: "© 2025 TOOLY GSM. All rights reserved.",
      signInBtn: "Sign In",
      signUpBtn: "Sign Up",
      nav: {
        home: "Home",
        packages: "Packages",
        services: "Services",
      },
      plans: [
        {
          name: "Small Plan",
          price: "3",
          period: "weekly",
          description: "Perfect for beginners and limited usage",
          buttonText: "Choose Small",
        },
        {
          name: "Medium Plan",
          price: "10",
          period: "monthly",
          description: "Best for technicians and commercial shops",
          buttonText: "Choose Medium",
        },
        {
          name: "Large Plan",
          price: "13",
          period: "monthly",
          description: "For professionals and large companies",
          buttonText: "Choose Large",
        },
      ],
      whyFeatures: [
        {
          title: "Complete Security",
          desc: "Your money is protected until service is successfully completed",
          icon: Shield,
        },
        {
          title: "Guaranteed Quality",
          desc: "All our technicians are tested with clear ratings",
          icon: Users,
        },
        {
          title: "Fast Execution",
          desc: "See expected time from each technician and choose what suits you",
          icon: Clock,
        },
        {
          title: "Competitive Prices",
          desc: "Technicians compete so you choose the best",
          icon: DollarSign,
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden" dir={language === "ar" ? "rtl" : "ltr"}>
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
                    لوحة التحكم
                  </Button>
                  <Button
                    onClick={handleLogout}
                    size="sm"
                    variant="outline"
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-base"
                  >
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => (window.location.href = "/auth/signup")}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-4 py-2 text-base"
                  >
                    إنشاء حساب
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/auth/signin")}
                    size="sm"
                    variant="outline"
                    className="hover:bg-orange-500 hover:text-white backdrop-blur-sm rounded-lg px-4 py-2 text-base text-white bg-transparent border-transparent"
                  >
                    تسجيل الدخول
                  </Button>
                </>
              )}
            </div>

            {/* Group all navigation items in one rounded container */}
            <div className="hidden md:flex items-center">
              <div className="bg-black/60 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 flex items-center gap-1">
                <a
                  href="/tools"
                  onClick={(e) => {

                    // Let the default navigation happen
                  }}
                  className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10"
                >
                  {currentContent.nav.services}
                </a>
                <a
                  href="/packages"
                  className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10"
                >
                  {currentContent.nav.packages}
                </a>
                <a
                  href="/"
                  className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10"
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
                <a
                  href="/tools"
                  onClick={(e) => {

                    setIsMobileMenuOpen(false)
                  }}
                  className="text-white hover:text-orange-400 transition-colors duration-300 font-medium py-2 text-base"
                >
                  {currentContent.nav.services}
                </a>

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
                        لوحة التحكم
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
                        تسجيل الخروج
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
                        إنشاء حساب
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
                        تسجيل الدخول
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero-background-new.png"
            alt="Tech Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>

        {/* Animated particles overlay */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-500/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-1 gap-12 items-center">
            {/* Left Content - now centered */}
            <div className="text-center" style={{ marginTop: "9cm" }}>
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-orange-500/40 backdrop-blur-sm border border-orange-500/50 rounded-full px-4 py-2">
                  <span className="text-white text-base font-medium">مهنية في الخدمة</span>
                </div>
                <div className="bg-orange-500/40 backdrop-blur-sm border border-orange-500/50 rounded-full px-4 py-2">
                  <span className="text-white text-base font-medium">شغال علي مدار الساعه</span>
                </div>
                <div className="bg-orange-500/40 backdrop-blur-sm border border-orange-500/50 rounded-full px-4 py-2">
                  <span className="text-white text-base font-medium">أمان كامل: فلوسك محمية لحد ما الخدمة تتم</span>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight font-arabic lg:text-5xl">
                إصلح تليفونك في أسرع وقت وأرخص سعر
              </h1>

              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed lg:text-2xl">
                بدل ما تكلم فني واحد، اعرض تليفونك وأكتر من فني يديك سعره... وانت اللي تختار
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-2xl px-12 py-6 shadow-2xl hover:scale-105 transition-all duration-300 group rounded-full"
                >
                  <span className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6" />
                    اطلب الآن
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How Platform Works Section */}
      <div
        className="py-20 relative"
        style={{ background: "linear-gradient(to bottom right, #1e1e1e 0%, #000000 50%, #1e1e1e 100%)" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 hover:text-orange-400 transition-colors duration-300">
              {currentContent.howItWorks}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {currentContent.platformSteps.map((step, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-all duration-500 bg-gradient-to-br from-orange-500 to-orange-600">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-white group-hover:text-orange-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className="py-20 relative"
        style={{ background: "linear-gradient(to bottom right, #1e1e1e 0%, #000000 50%, #1e1e1e 100%)" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 hover:text-orange-400 transition-colors duration-300">
              {currentContent.whyUs}
            </h2>
            <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {currentContent.whyUsDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {currentContent.whyFeatures.map((feature, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/50 to-orange-500/50 animate-pulse" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300">
            {currentContent.ctaTitle}
          </h2>
          <p className="text-2xl md:text-3xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {currentContent.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 text-xl px-8 py-6 shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {currentContent.ctaButton}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-500 text-xl px-8 py-6 bg-transparent hover:scale-105 transition-all duration-300"
            >
              {currentContent.consultBtn}
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="py-20 bg-black relative" style={{ marginTop: "9cm", marginBottom: "4cm" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 text-center group hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                مهنية في الخدمة
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                فريق من المحترفين المدربين على أعلى مستوى لضمان جودة الخدمة
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 text-center group hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                جودة مضمونة كل الوقت
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                نضمن لك أفضل جودة في الخدمة مع متابعة مستمرة لضمان رضاك التام
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-8 text-center group hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors duration-300">
                أمان كامل: فلوسك محمية لحد ما الخدمة تتم
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                نظام دفع آمن يحمي أموالك حتى اكتمال الخدمة بنجاح وحصولك على النتيجة المطلوبة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Image
              src="/tooly-gsm-logo-new.png"
              alt="TOOLY GSM Logo"
              width={112}
              height={56}
              className="mx-auto opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300"
            />
          </div>
          <p className="text-gray-300 mb-4 hover:text-white transition-colors duration-300 text-lg">
            {currentContent.copyright}
          </p>
          <p className="text-gray-500 hover:text-gray-400 transition-colors duration-300 text-base">
            Unlocking Solutions & GSM Services
          </p>
        </div>
      </footer>
    </div>
  )
}
