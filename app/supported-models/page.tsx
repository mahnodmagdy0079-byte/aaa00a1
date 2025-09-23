"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

export default function SupportedModelsPage() {
  const { language, setLanguage } = useLanguage()

  const brands = ["Samsung", "Xiaomi", "Huawei", "Oppo", "Vivo", "Realme"]

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md border-b border-orange-500/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/tooly-gsm-logo-new.png" alt="TOOLY GSM Logo" width={32} height={16} />
          </div>
          <div className="hidden md:flex items-center">
            <div className="bg-black/60 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 flex items-center gap-1">
              <a href="/tools" className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10">{language === "ar" ? "خدمات" : "Services"}</a>
              <a href="/downloads" className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10">{language === "ar" ? "التحميل" : "Downloads"}</a>
              <a href="/supported-models" className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10">{language === "ar" ? "الموديلات المدعومة" : "Supported Models"}</a>
              <a href="/packages" className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10">{language === "ar" ? "الباقات" : "Packages"}</a>
              <a href="/" className="text-white hover:text-orange-300 transition-all duration-300 font-medium text-base px-4 py-2 rounded-full hover:bg-orange-500/10">{language === "ar" ? "الرئيسية" : "Home"}</a>
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1 border border-orange-500/20">
            <div className="flex items-center gap-1">
              <button onClick={() => setLanguage("en")} className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${language === "en" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}>English</button>
              <button onClick={() => setLanguage("ar")} className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${language === "ar" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"}`}>عربي</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "ar" ? "الموديلات المدعومة" : "Supported Models"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "ar" ? "تعرّف على الموديلات المدعومة في أدواتنا." : "See the models supported by our tools."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {brands.map((brand) => (
            <div key={brand} className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/20 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{brand}</h3>
              <p className="text-gray-400 mb-4">
                {language === "ar" ? "قائمة الموديلات المحدّثة متاحة داخل الأداة." : "Updated model list is available inside the tool."}
              </p>
              <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
                {language === "ar" ? "عرض التفاصيل" : "View Details"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


