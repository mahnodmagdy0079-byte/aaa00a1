"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import Head from "next/head"
import SiteNav from "@/components/site-nav"

export default function SupportedModelsPage() {
  const { language, setLanguage } = useLanguage()


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
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            {language === "ar" ? "قريباً ستتوفر للجميع" : "Coming Soon - Available to Everyone"}
          </p>
          <p className="text-orange-400 max-w-4xl mx-auto text-lg">
            {language === "ar" 
              ? "خدمة شاملة تقدم جميع الأدوات والموديلات المدعومة لتمكين المقارنة السريعة بين الأدوات المختلفة لكل موديل" 
              : "Comprehensive service providing all supported tools and models for quick comparison between different tools for each model"}
          </p>
        </div>

        {/* Example Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center">
              {language === "ar" ? "مثال توضيحي" : "Example"}
            </h2>
            
            <div className="space-y-6">
              {/* Device Model */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {language === "ar" ? "موديل الجهاز:" : "Device Model:"} <span className="text-orange-400">Samsung A03 Core</span>
                </h3>
                <p className="text-gray-300">
                  <span className="text-orange-400">SM-A032F</span>
                </p>
              </div>

              {/* Tools Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Unlock Tool */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-orange-400 mb-3">Unlock Tool</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">• Testpoint Flash</p>
                    <p className="text-gray-300 text-sm">• Factory Reset</p>
                    <p className="text-gray-300 text-sm">• Erase FRP</p>
                    <p className="text-gray-300 text-sm">• Direct Unlock</p>
                  </div>
                </div>

                {/* AMT Tool */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-orange-400 mb-3">AMT Tool</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">• Factory Reset</p>
                    <p className="text-gray-300 text-sm">• Reset FRP</p>
                    <p className="text-gray-300 text-sm">• Flash</p>
                    <p className="text-gray-300 text-sm">• Fix DeadBoot</p>
                    <p className="text-gray-300 text-sm">• Partition Manager</p>
                  </div>
                </div>

                {/* Cheetah Tool */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-orange-400 mb-3">Cheetah Tool</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">• Direct Format</p>
                    <p className="text-gray-300 text-sm">• Ask Code</p>
                    <p className="text-gray-300 text-sm">• Change Knox Guard</p>
                    <p className="text-gray-300 text-sm">• Restore/Backup Security</p>
                    <p className="text-gray-300 text-sm">• Read/write/Erase RPMB</p>
                    <p className="text-gray-300 text-sm">• Factory Reset</p>
                    <p className="text-gray-300 text-sm">• Unlock/Relock Bootloader</p>
                    <p className="text-gray-300 text-sm">• Write firmware</p>
                    <p className="text-gray-300 text-sm">• Read firmware</p>
                    <p className="text-gray-300 text-sm">• Readinfo</p>
                    <p className="text-gray-300 text-sm">• Reset FRP Lock</p>
                    <p className="text-gray-300 text-sm">• Reset-MDM/pay joy</p>
                    <p className="text-gray-300 text-sm">• Direct Unlock Network</p>
                    <p className="text-gray-300 text-sm">• Wipe partition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


