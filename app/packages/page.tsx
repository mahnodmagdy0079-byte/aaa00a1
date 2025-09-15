"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Check, Star, Phone, Settings, Crown, ArrowRight, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"

export default function PackagesPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { language, setLanguage } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [license, setLicense] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPlan, setUserPlan] = useState("")
  const [authLoading, setAuthLoading] = useState(true) // Added auth loading state

  useEffect(() => {
    setIsVisible(true)
    checkUser()
    checkAuthStatus() // Enhanced auth check
  }, [])

  const checkAuthStatus = async () => {
    try {
      const savedLicense = localStorage.getItem("userLicense")
      const savedPlan = localStorage.getItem("userPlan")
      if (savedLicense && savedPlan) {
        setIsLoggedIn(true)
        setUserPlan(savedPlan)
      } else {
        setIsLoggedIn(false)
        setUserPlan("")
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const checkUser = async () => {
    setUser(null)
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    try {
      if (!license.trim()) {
        setLoginError(language === "ar" ? "أدخل الترخيص" : "Enter license")
        return
      }
      // مؤقتاً: حفظ الترخيص فقط في التخزين المحلي، بدون اتصال مباشر بقاعدة البيانات من الواجهة
      localStorage.setItem("userLicense", license)
      localStorage.setItem("userPlan", userPlan || "")
      setIsLoggedIn(true)
      setUserPlan(userPlan || "")
      setShowLogin(false)
      setLicense("")
      window.location.href = "/dashboard"
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
      title: "اختر باقتك المثالية",
      subtitle: "حلول احترافية لفتح الأقفال وخدمات GSM المتقدمة",
      currency: "جنيه",
      popular: "الأكثر طلباً",
      signInBtn: "تسجيل الدخول",
      signUpBtn: "إنشاء حساب",
      nav: {
        home: "الرئيسية",
        packages: "الباقات",
        services: "خدمات",
        dashboard: "لوحة التحكم",
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
    },
    en: {
      title: "Choose Your Perfect Plan",
      subtitle: "Professional unlocking solutions & advanced GSM services",
      currency: "$",
      popular: "Most Popular",
      signInBtn: "Sign In",
      signUpBtn: "Sign Up",
      nav: {
        home: "Home",
        packages: "Packages",
        services: "Services",
        dashboard: "Dashboard",
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
    },
  }

  const currentContent = content[language]

  const plans = [
    {
      ...currentContent.plans[0],
      popular: false,
      features:
        language === "ar"
          ? ["UNLOCK TOOL", "CF TOOL", "Cheetah TOOL", "دعم فني أساسي", "تحديثات البرامج"]
          : ["UNLOCK TOOL", "CF TOOL", "Cheetah TOOL", "Basic Technical Support", "Software Updates"],
      icon: Phone,
      color: "from-blue-500 to-purple-600",
    },
    {
      ...currentContent.plans[1],
      popular: true,
      features:
        language === "ar"
          ? [
              "UNLOCK TOOL",
              "AMT",
              "TSM TOOL",
              "CF TOOL",
              "TFM TOOL",
              "Cheetah TOOL",
              "Global Unlocker Pro",
              "دعم فني متقدم",
            ]
          : [
              "UNLOCK TOOL",
              "AMT",
              "TSM TOOL",
              "CF TOOL",
              "TFM TOOL",
              "Cheetah TOOL",
              "Global Unlocker Pro",
              "Advanced Technical Support",
            ],
      icon: Settings,
      color: "from-orange-500 to-red-500",
    },
    {
      ...currentContent.plans[2],
      popular: false,
      features:
        language === "ar"
          ? [
              "UNLOCK TOOL",
              "AMT",
              "TSM TOOL",
              "CF TOOL",
              "TFM TOOL",
              "Cheetah TOOL",
              "Global Unlocker Pro",
              "Oxygen Forensics",
              "All Tablets Format",
              "دعم فني مخصص على مدار الساعة",
            ]
          : [
              "UNLOCK TOOL",
              "AMT",
              "TSM TOOL",
              "CF TOOL",
              "TFM TOOL",
              "Cheetah TOOL",
              "Global Unlocker Pro",
              "Oxygen Forensics",
              "All Tablets Format",
              "24/7 Dedicated Technical Support",
            ],
      icon: Crown,
      color: "from-purple-500 to-pink-500",
    },
  ]

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
                    {currentContent.nav.dashboard}
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
                    {currentContent.signUpBtn}
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/auth/signin")}
                    size="sm"
                    variant="outline"
                    className="hover:bg-orange-500 hover:text-white backdrop-blur-sm rounded-lg px-4 py-2 text-base text-white bg-transparent border-transparent"
                  >
                    {currentContent.signInBtn}
                  </Button>
                </>
              )}
            </div>

            {/* Group all navigation items in one rounded container */}
            <div className="hidden md:flex items-center">
              <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 flex items-center gap-1">
                <a
                  href="/tools"
                  className="text-white/90 hover:text-orange-400 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10"
                >
                  {currentContent.nav.services}
                </a>
                <a
                  href="/packages"
                  className="text-orange-400 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full bg-orange-500/10"
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
                  className="text-orange-400 font-medium py-2 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentContent.nav.packages}
                </a>
                <a
                  href="/tools"
                  className="text-white hover:text-orange-400 transition-colors duration-300 font-medium py-2 text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                        {currentContent.nav.dashboard}
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
                        {currentContent.signUpBtn}
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
                        {currentContent.signInBtn}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header Section */}
      <div className="pt-24 pb-12 bg-black relative">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="TOOLY GSM Logo"
              width={200}
              height={100}
              className="mx-auto opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-500"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 hover:text-orange-400 transition-colors duration-500">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">{currentContent.subtitle}</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 bg-black relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon
              const isHovered = hoveredCard === index
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    plan.popular
                      ? "border-orange-500 shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 ring-2 ring-orange-500/20"
                      : "border-gray-700 hover:border-orange-500/50 bg-gray-900 hover:shadow-xl"
                  } ${isHovered ? "shadow-2xl border-orange-400" : ""}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    minHeight: "600px",
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-5" : ""}`}
                  />

                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 text-sm font-semibold">
                      <Star className="w-4 h-4 inline ml-2" />
                      {currentContent.popular}
                    </div>
                  )}

                  <CardHeader className={`text-center pb-6 ${plan.popular ? "pt-16" : "pt-8"} relative z-10`}>
                    <div
                      className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isHovered ? "shadow-xl" : ""}`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white mb-2 transition-colors duration-300">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-base transition-colors duration-300 px-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span
                        className={`text-4xl font-bold transition-all duration-300 ${isHovered ? "text-orange-400" : "text-orange-500"}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-gray-400 mr-2 text-base">{currentContent.currency}</span>
                      <span className="text-gray-400 text-sm">/ {plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 relative z-10 flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3 transition-all duration-200">
                          <Check
                            className={`w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5 transition-colors duration-300 ${isHovered ? "text-orange-400" : ""}`}
                          />
                          <span className="text-white text-sm leading-relaxed whitespace-pre-line">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-6 relative z-10 mt-auto">
                    <Link
                      href={`/payment?package=${encodeURIComponent(plan.name)}&price=${plan.price}&period=${plan.period}&currency=${currentContent.currency}`}
                      className={`w-full text-base py-4 group transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-800 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 text-white hover:shadow-lg"
                      } rounded-lg flex items-center justify-center font-medium`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {plan.buttonText}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                        />
                      </span>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
