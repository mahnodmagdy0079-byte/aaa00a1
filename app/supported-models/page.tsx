"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import Head from "next/head"
import SiteNav from "@/components/site-nav"

export default function SupportedModelsPage() {
  const { language, setLanguage } = useLanguage()

  const brands = ["Samsung", "Xiaomi", "Huawei", "Oppo", "Vivo", "Realme"]

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>TOOLY GSM – الموديلات المدعومة | Supported Models</title>
        <meta name="description" content="تعرّف على الموديلات المدعومة في أدوات TOOLY GSM: Samsung, Xiaomi, Huawei, Oppo, Vivo, Realme وأكثر." />
        <meta property="og:title" content="TOOLY GSM – الموديلات المدعومة" />
        <meta property="og:description" content="قائمة الموديلات المدعومة في أدواتنا" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/tooly-gsm-logo-new.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="ar" href="https://eskuly.org/supported-models" />
        <link rel="alternate" hrefLang="en" href="https://eskuly.org/supported-models" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TOOLY GSM',
              url: 'https://eskuly.org',
              logo: '/tooly-gsm-logo-new.png',
            }),
          }}
        />
      </Head>
      <SiteNav />

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


