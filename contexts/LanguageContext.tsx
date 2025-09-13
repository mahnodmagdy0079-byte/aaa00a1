"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation object
const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.packages": "الباقات",
    "nav.services": "خدمات",
    "nav.dashboard": "لوحة التحكم",
    "nav.signIn": "تسجيل الدخول",
    "nav.signUp": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "تم بنجاح",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.save": "حفظ",
    "common.edit": "تعديل",
    "common.delete": "حذف",

    // Dashboard
    "dashboard.title": "لوحة التحكم",
    "dashboard.welcome": "مرحباً بك",
    "dashboard.toolRequest": "طلب أداة",
    "dashboard.phoneListings": "عرض الهواتف",
    "dashboard.pendingRequest": "طلبك قيد المراجعة",

    // Packages
    "packages.title": "الباقات المتاحة",
    "packages.small": "الباقة الصغيرة",
    "packages.medium": "الباقة المتوسطة",
    "packages.large": "الباقة الكبيرة",
    "packages.buyNow": "اشتري الآن",

    // Auth
    "auth.signIn": "تسجيل الدخول",
    "auth.signUp": "إنشاء حساب جديد",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.confirmPassword": "تأكيد كلمة المرور",

    // Payment
    "payment.title": "صفحة الدفع",
    "payment.packageDetails": "تفاصيل الباقة",
    "payment.phoneNumber": "رقم الهاتف",
    "payment.submitRequest": "إرسال طلب الشراء",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.packages": "Packages",
    "nav.services": "Services",
    "nav.dashboard": "Dashboard",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.logout": "Logout",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome",
    "dashboard.toolRequest": "Tool Request",
    "dashboard.phoneListings": "Phone Listings",
    "dashboard.pendingRequest": "Your request is under review",

    // Packages
    "packages.title": "Available Packages",
    "packages.small": "Small Package",
    "packages.medium": "Medium Package",
    "packages.large": "Large Package",
    "packages.buyNow": "Buy Now",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Create New Account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.confirmPassword": "Confirm Password",

    // Payment
    "payment.title": "Payment Page",
    "payment.packageDetails": "Package Details",
    "payment.phoneNumber": "Phone Number",
    "payment.submitRequest": "Submit Purchase Request",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    // Update document direction
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  useEffect(() => {
    // Set initial document direction and language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
