"use client"

import Head from "next/head"

export default function SEOHead() {
  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://eskuly.org" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="language" content="Arabic" />
      <meta name="geo.region" content="EG" />
      <meta name="geo.country" content="Egypt" />
      <meta name="geo.placename" content="Egypt" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TOOLY GSM" />
      <meta property="og:locale" content="ar_EG" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@toolygsm" />
      
      {/* Additional Verification Tags */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TOOLY GSM",
            "url": "https://eskuly.org",
            "logo": "https://eskuly.org/tooly-gsm-logo-new.png",
            "description": "خدمات إصلاح الهواتف وإلغاء القفل بأفضل الأسعار في مصر",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "EG",
              "addressRegion": "Egypt"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["Arabic", "English"]
            },
            "sameAs": [
              "https://eskuly.org"
            ]
          })
        }}
      />
    </Head>
  )
}
