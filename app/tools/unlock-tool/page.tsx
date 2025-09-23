"use client"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { ArrowLeft, Info, Clock, DollarSign, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const baseUrl = "https://eskuly.org"

export default function UnlockToolPage() {
  const { language, setLanguage } = useLanguage()

  const content = {
    ar: {
      title: "UNLOCK TOOL",
      subtitle: "أداة فتح الأجهزة المحمولة المتقدمة",
      backToTools: "العودة للأدوات",
      price: "40 جنيه",
      duration: "6 ساعات",
      getAccess: "احصل على الوصول",
      features: {
        title: "المميزات الرئيسية",
        list: [
          "فتح جميع أنواع الأجهزة المحمولة",
          "دعم أكثر من 1000 موديل",
          "إزالة FRP (Factory Reset Protection)",
          "إزالة قفل الشاشة",
          "إصلاح مشاكل النظام",
          "دعم Android و iOS"
        ]
      },
      howItWorks: {
        title: "كيف يعمل",
        steps: [
          "قم بتسجيل الدخول إلى حسابك",
          "اختر UNLOCK TOOL من قائمة الأدوات",
          "اتبع التعليمات في البرنامج",
          "استمتع بالوصول الكامل للأداة لمدة 6 ساعات"
        ]
      },
      requirements: {
        title: "المتطلبات",
        list: [
          "حساب نشط في منصة Tooly GSM",
          "رصيد كافي في المحفظة (40 جنيه)",
          "برنامج Tooly GSM Desktop",
          "اتصال بالإنترنت"
        ]
      },
      faq: {
        title: "الأسئلة الشائعة",
        items: [
          { q: "ما هي مدة الاستخدام؟", a: "6 ساعات من وقت التفعيل، مع إعادة الاستخدام مجاناً داخل المدة." },
          { q: "هل هناك استرجاع؟", a: "إن فشل التشغيل بسبب مشاكل خادم الأداة يتم مراجعة الحالة يدوياً." },
          { q: "هل تدعم إزالة FRP؟", a: "نعم، تدعم العديد من الموديلات حسب تحديثات الأداة." },
          { q: "هل أحتاج كريدت؟", a: "لا، الدفع يتم من محفظتك داخل Tooly GSM." }
        ]
      }
    },
    en: {
      title: "UNLOCK TOOL",
      subtitle: "Advanced Mobile Device Unlocking Tool",
      backToTools: "Back to Tools",
      price: "40 EGP",
      duration: "6 hours",
      getAccess: "Get Access",
      features: {
        title: "Key Features",
        list: [
          "Unlock all types of mobile devices",
          "Support for over 1000 models",
          "Remove FRP (Factory Reset Protection)",
          "Remove screen lock",
          "Fix system issues",
          "Android and iOS support"
        ]
      },
      howItWorks: {
        title: "How It Works",
        steps: [
          "Log in to your account",
          "Choose UNLOCK TOOL from the tools list",
          "Follow the instructions in the program",
          "Enjoy full access to the tool for 6 hours"
        ]
      },
      requirements: {
        title: "Requirements",
        list: [
          "Active Tooly GSM account",
          "Sufficient wallet balance (40 EGP)",
          "Tooly GSM Desktop program",
          "Internet connection"
        ]
      },
      faq: {
        title: "FAQs",
        items: [
          { q: "How long is access?", a: "6 hours from activation, with free reuse within the window." },
          { q: "Refund policy?", a: "If the tool fails due to vendor issues, cases are manually reviewed." },
          { q: "FRP support?", a: "Yes, for many models depending on tool updates." },
          { q: "Need credits?", a: "No, payment is via your Tooly GSM wallet." }
        ]
      }
    }
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-black text-white" dir={language === "ar" ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "UNLOCK TOOL",
            applicationCategory: "MobileApplication",
            operatingSystem: "Windows",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlocktool-NPHtho1CAQGcQHKCNF6xxWGzTPvRkS.png",
            description:
              "وصول سريع لأداة UNLOCK TOOL لمدة 6 ساعات عبر أتمتة Tooly GSM بأسعار اقتصادية.",
            offers: {
              "@type": "Offer",
              priceCurrency: "EGP",
              price: "40",
              availability: "https://schema.org/InStock",
              url: `${baseUrl}/tools/unlock-tool`,
            },
            brand: {
              "@type": "Brand",
              name: "Tooly GSM",
            },
          }),
        }}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-orange-500/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/tools"
              className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${language === "ar" ? "rotate-180 ml-2" : "mr-2"}`} />
              {currentContent.backToTools}
            </Link>
            
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

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-2xl bg-gray-800 p-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlocktool-NPHtho1CAQGcQHKCNF6xxWGzTPvRkS.png"
                alt="UNLOCK TOOL"
                width={128}
                height={128}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                {currentContent.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{currentContent.subtitle}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
                <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                  <span className="text-orange-500 font-bold">{currentContent.price}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-500 font-bold">{currentContent.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Features */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-500">
                <Zap className="w-5 h-5" />
                {currentContent.features.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentContent.features.list.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-500">
                <Info className="w-5 h-5" />
                {currentContent.howItWorks.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {currentContent.howItWorks.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="bg-gray-900/50 border-gray-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <Shield className="w-5 h-5" />
                {currentContent.requirements.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContent.requirements.list.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link href="/auth/signin">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300">
              {currentContent.getAccess}
            </Button>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{currentContent.faq.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentContent.faq.items.map((item: any, idx: number) => (
                  <details key={idx} className="bg-gray-800/40 rounded-lg p-4">
                    <summary className="cursor-pointer text-orange-400 font-semibold">{item.q}</summary>
                    <p className="text-gray-300 mt-2">{item.a}</p>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
