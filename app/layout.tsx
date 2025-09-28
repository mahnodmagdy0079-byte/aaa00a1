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
  title: "TOOLY GSM - إصلاح الهواتف وإلغاء القفل (Unlock Tool • FRP) | خدمات GSM",
  description: "خدمات إصلاح الهواتف وإلغاء القفل بأفضل الأسعار في مصر. Unlock Tool, FRP Tool, Format, IMEI Check وأكثر. فريق محترف، أمان كامل، جودة مضمونة. احصل على شير Unlock Tool وFRP Tool فورًا وابدأ الآن!",
  keywords: "إصلاح الهواتف, إلغاء القفل, Unlock Tool, FRP, FRP Tool, Format, IMEI Check, خدمات GSM, إصلاح موبايل, فتح الهاتف, مصر, شير Unlock Tool, شير FRP",
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
      <body className="bg-black text-white min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
