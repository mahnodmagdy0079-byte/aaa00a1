"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Phone, CreditCard, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function PaymentPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const packageName = searchParams.get("package") || "الباقة المتوسطة"
  const price = searchParams.get("price") || "400"
  const period = searchParams.get("period") || "شهرياً"
  const currency = searchParams.get("currency") || "جنيه"

  const vodafoneCashNumber = "01098049153"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        console.log("[v0] Supabase client not available")
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("يجب تسجيل الدخول أولاً")
        return
      }

      const { error } = await supabase.from("purchase_requests").insert({
        user_email: user.email,
        package_name: packageName,
        package_price: price,
        package_period: period,
        currency: currency,
        phone_number: phoneNumber,
        status: "pending",
      })

      if (error) {
        console.error("Error saving purchase request:", error)
        alert("حدث خطأ في إرسال الطلب. حاول مرة أخرى.")
        return
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("حدث خطأ في إرسال الطلب. حاول مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-green-500">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-white">تم إرسال طلبك بنجاح!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">سيتم التواصل معك قريباً لتأكيد الدفع وتفعيل باقتك</p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-white font-semibold">تفاصيل طلبك:</p>
              <p className="text-gray-300">الباقة: {packageName}</p>
              <p className="text-gray-300">
                السعر: {price} {currency}
              </p>
              <p className="text-gray-300">رقم الهاتف: {phoneNumber}</p>
            </div>

            <div className="pt-4">
              <a
                href="https://wa.me/201098049153"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center mb-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                تواصل معنا عبر الواتساب
              </a>
            </div>

            <Link href="/packages">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">العودة للباقات</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4" dir="rtl">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Link href="/packages">
            <Button variant="ghost" size="sm" className="text-white hover:text-orange-500">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للباقات
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">إتمام الشراء</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Package Details */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                تفاصيل الباقة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">{packageName}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">السعر:</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {price} {currency}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-300">المدة:</span>
                  <span className="text-white">{period}</span>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">ضمان الأمان</span>
                </div>
                <p className="text-gray-300 text-sm">جميع المدفوعات محمية ومضمونة. سيتم تفعيل باقتك فور تأكيد الدفع.</p>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span className="text-green-400 font-semibold">تحتاج مساعدة؟</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">تواصل معنا مباشرة عبر الواتساب لأي استفسار أو مساعدة</p>
                <a
                  href="https://wa.me/201098049153"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  واتساب
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-500" />
                معلومات الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                  <p className="text-sm text-gray-400">سيتم التواصل معك على هذا الرقم لتأكيد الدفع</p>
                </div>

                <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                  <h4 className="text-orange-400 font-semibold mb-2">طريقة الدفع:</h4>
                  <div className="space-y-2">
                    <p className="text-white">فودافون كاش</p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-gray-300 text-sm">الرقم:</p>
                      <p className="text-xl font-bold text-orange-500 font-mono">{vodafoneCashNumber}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      قم بتحويل المبلغ المطلوب إلى الرقم أعلاه، وسيتم التواصل معك لتأكيد الدفع وتفعيل الباقة
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg"
                  disabled={!phoneNumber.trim() || isLoading}
                >
                  {isLoading ? "جاري الإرسال..." : "إرسال طلب الشراء"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
