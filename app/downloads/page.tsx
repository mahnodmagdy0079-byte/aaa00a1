"use client"

import Image from "next/image"
import SiteNav from "@/components/site-nav"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import Head from "next/head"

export default function DownloadsPage() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>TOOLY GSM – التحميل (Unlock Tool • FRP) | Downloads</title>
        <meta name="description" content="قم بتحميل برنامج TOOLY GSM الرسمي. Unlock Tool, FRP Tool, Format, IMEI Check – سريع وآمن. ابدأ التحميل الآن." />
        <meta property="og:title" content="TOOLY GSM – التحميل (Unlock Tool • FRP)" />
        <meta property="og:description" content="تحميل برنامج TOOLY GSM الرسمي: Unlock Tool, FRP Tool وأكثر." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/tooly-gsm-logo-new.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="ar" href="https://eskuly.org/downloads" />
        <link rel="alternate" hrefLang="en" href="https://eskuly.org/downloads" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'TOOLY GSM',
              operatingSystem: 'Windows',
              applicationCategory: 'UtilitiesApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EGP' },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'هل البرنامج مجاني؟',
                  acceptedAnswer: { '@type': 'Answer', text: 'يوفر نسخ/خطط حسب الاستخدام. قد تتطلب بعض الأدوات اشتراكاً أو رصيد محفظة.' },
                },
                {
                  '@type': 'Question',
                  name: 'على أي أنظمة يعمل TOOLY GSM؟',
                  acceptedAnswer: { '@type': 'Answer', text: 'البرنامج متوافق مع أنظمة ويندوز الحديثة.' },
                },
                {
                  '@type': 'Question',
                  name: 'ما الأدوات المدعومة؟',
                  acceptedAnswer: { '@type': 'Answer', text: 'Unlock Tool, FRP Tool, TFM, AMTTSM, CF, Cheetah وأدوات أخرى.' },
                },
              ],
            }),
          }}
        />
      </Head>
      <SiteNav />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-orange-500">
            {language === "ar" ? "التحميل" : "Downloads"}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {language === "ar" ? "قم بتحميل برنامج TOOLY GSM الرسمي." : "Download the official TOOLY GSM application."}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* Left: big app image (moved slightly up) */}
            <div className="shrink-0 relative" style={{ marginTop: "-1cm" }}>
              {/* Soft orange outer glow behind the box (stronger and larger) */}
              <div
                className="pointer-events-none absolute -inset-16 rounded-[40px] opacity-70 z-0"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(249,115,22,0.28), rgba(249,115,22,0.14) 55%, transparent 82%)",
                  filter: "blur(70px)",
                }}
              />
              <Image
                src="/app1.png"
                alt="TOOLY GSM"
                width={748}
                height={900}
                className="object-contain relative z-10"
                style={{ filter: "drop-shadow(0 0 12px rgba(249,115,22,0.25))" }}
              />
              <div className="absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-t from-white/10 to-transparent blur-md opacity-60 rounded-full z-0" />
            </div>

            {/* Right: text and download button */}
            <div className="flex-1 text-left" style={{ marginTop: "3cm" }}>
              <h3 className="text-3xl font-bold text-white mb-3">TOOLY GSM</h3>
              <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                {language === "ar"
                  ? "برنامج احترافي لإدارة وطلب أدوات GSM بسرعة وأمان. مناسب للفنيين والمحترفين ويعمل على ويندوز."
                  : "Professional app to manage and request GSM tools quickly and securely. Built for technicians and pros, works on Windows."}
              </p>
              <p className="text-gray-300 mb-8 text-sm md:text-base">
                {language === "ar"
                  ? "أول منصة ذكية لمشاركة أدوات GSM بشكل تلقائي وآمن"
                  : "The first smart platform to share GSM tools automatically and securely"}
              </p>
              <div className="flex justify-center md:justify-start">
                <a href="https://mega.nz/file/tuwgBKSK#ccUzLdZ5nCoNEUjbO-an-N8B7mHhFuYuwoWwL2jhwHI" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white min-w-[220px] text-base md:text-lg px-8 py-4">
                    <span>{language === "ar" ? "تحميل البرنامج" : "Download App"}</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extras section to fill space */}
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-white font-semibold mb-1">{language === "ar" ? "أمان" : "Security"}</div>
              <div className="text-gray-400 text-sm">{language === "ar" ? "تشفير واتصال آمن" : "Encrypted and secure"}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold mb-1">{language === "ar" ? "سرعة" : "Speed"}</div>
              <div className="text-gray-400 text-sm">{language === "ar" ? "أداء عالي واستجابة سريعة" : "High performance, fast response"}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">💻</div>
              <div className="text-white font-semibold mb-1">Windows</div>
              <div className="text-gray-400 text-sm">{language === "ar" ? "متوافق مع إصدارات ويندوز الحديثة" : "Compatible with modern Windows"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            <details className="bg-white/5 border border-white/10 rounded-xl p-4">
              <summary className="cursor-pointer text-white font-semibold">
                {language === "ar" ? "هل البرنامج مجاني؟" : "Is the app free?"}
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                {language === "ar"
                  ? "يوفر نسخ/خطط حسب الاستخدام. قد تتطلب بعض الأدوات اشتراكاً أو رصيد محفظة."
                  : "Plans may vary by usage. Some tools require a subscription or wallet credit."}
              </p>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl p-4">
              <summary className="cursor-pointer text-white font-semibold">
                {language === "ar" ? "على أي أنظمة يعمل TOOLY GSM؟" : "Which OS does TOOLY GSM support?"}
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                {language === "ar" ? "البرنامج متوافق مع إصدارات ويندوز الحديثة." : "The app supports modern versions of Windows."}
              </p>
            </details>
            <details className="bg-white/5 border border-white/10 rounded-xl p-4">
              <summary className="cursor-pointer text-white font-semibold">
                {language === "ar" ? "ما الأدوات المدعومة؟" : "Which tools are supported?"}
              </summary>
              <p className="text-gray-300 mt-2 text-sm">
                {language === "ar"
                  ? "يدعم Unlock Tool, FRP Tool, TFM, AMTTSM, CF, Cheetah وأدوات أخرى."
                  : "Supports Unlock Tool, FRP Tool, TFM, AMTTSM, CF, Cheetah and more."}
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}


