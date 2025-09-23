import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Cairo } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "TOOLY GSM - إصلاح الهواتف وإلغاء القفل بأفضل الأسعار | خدمات GSM متخصصة",
  description: "خدمات إصلاح الهواتف وإلغاء القفل بأفضل الأسعار في مصر. Unlock Tool, Format, IMEI Check وأكثر. فريق محترف، أمان كامل، جودة مضمونة. اطلب خدمتك الآن!",
  keywords: "إصلاح الهواتف, إلغاء القفل, Unlock Tool, Format, IMEI Check, خدمات GSM, إصلاح موبايل, فتح الهاتف, مصر",
  authors: [{ name: "TOOLY GSM" }],
  creator: "TOOLY GSM",
  publisher: "TOOLY GSM",
  robots: "index, follow",
  openGraph: {
    title: "TOOLY GSM - إصلاح الهواتف وإلغاء القفل بأفضل الأسعار",
    description: "خدمات إصلاح الهواتف وإلغاء القفل بأفضل الأسعار في مصر. فريق محترف، أمان كامل، جودة مضمونة.",
    url: "https://eskuly.org",
    siteName: "TOOLY GSM",
    images: [
      {
        url: "https://eskuly.org/tooly-gsm-logo-new.png",
        width: 1200,
        height: 630,
        alt: "TOOLY GSM - خدمات إصلاح الهواتف",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOOLY GSM - إصلاح الهواتف وإلغاء القفل",
    description: "خدمات إصلاح الهواتف وإلغاء القفل بأفضل الأسعار في مصر",
    images: ["https://eskuly.org/tooly-gsm-logo-new.png"],
  },
  alternates: {
    canonical: "https://eskuly.org",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
