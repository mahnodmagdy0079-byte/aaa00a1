"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkUserPendingRequest } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  LogOut,
  Smartphone,
  Plus,
  MapPin,
  DollarSign,
  Clock,
  User,
  Heart,
  MessageCircle,
  Share,
  CheckCircle,
  AlertCircle,
  Wrench,
  ShoppingCart,
  Info,
  Tablet,
  Wallet,
  FileText,
  Users,
  UserPlus,
  Shield,
} from "lucide-react"
 

import { purchaseToolAction, getActiveToolRequestsAction, updateExpiredToolRequestsAction, getToolsAction, getPhoneListingsAction, createPhoneListingAction, signOutAction } from "./actions"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [licenseData, setLicenseData] = useState<any>(null)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [hasPendingRequest, setHasPendingRequest] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<any>(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [activeToolRequests, setActiveToolRequests] = useState<any[]>([])
  const [isLoadingActiveTools, setIsLoadingActiveTools] = useState(false)
  const [isPurchasingTool, setIsPurchasingTool] = useState(false)
  const [purchaseMessage, setPurchaseMessage] = useState("")
  const [availableTools, setAvailableTools] = useState<any[]>([])
  const [isLoadingTools, setIsLoadingTools] = useState(false)
  const [phoneListings, setPhoneListings] = useState<any[]>([])
  const [showAddPhone, setShowAddPhone] = useState(false)
  const [activeSection, setActiveSection] = useState("information")
  const [toolRequest, setToolRequest] = useState({
    deviceId: "",
    password: "",
    toolType: "",
    tabletModel: "", // Added tablet model field
    notes: "",
  })
  const [isSubmittingTool, setIsSubmittingTool] = useState(false)
  const [toolSubmitMessage, setToolSubmitMessage] = useState("")
  const [toolSubmitSuccess, setToolSubmitSuccess] = useState(false)
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const [newPhoneRequest, setNewPhoneRequest] = useState({
    phoneModel: "",
    problemType: "",
    description: "",
    budget: "",
    location: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [nonSubscriberTab, setNonSubscriberTab] = useState("request")
  const [userRequests, setUserRequests] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

    // معلومات المستخدم: جلب عنوان IP (مؤقتاً معطل)
    const [userIp, setUserIp] = useState("")
    // useEffect(() => {
    //   const fetchIp = async () => {
    //     try {
    //       const res = await fetch("https://api.ipify.org?format=json")
    //       const data = await res.json()
    //       setUserIp(data.ip)
    //     } catch (err) {
    //       setUserIp("")
    //     }
    //   }
    //   fetchIp()
    // }, [])

  const router = useRouter()

  const { language, setLanguage } = useLanguage()

  const content = {
    ar: {
      welcome: "مرحباً بك",
      subscribed: "مشترك",
      notSubscribed: "غير مشترك",
      daysRemaining: "يوم متبقي",
      addPhone: "عرض هاتف للإصلاح",
      makePhone: "عرض التليفونات",
      getTool: "طلب أداة",
      phoneModel: "موديل الهاتف",
      problemType: "نوع المشكلة",
      description: "وصف المشكلة",
      budget: "الميزانية المتوقعة",
      location: "الموقع",
      createListing: "نشر الطلب",
      noPhones: "لا توجد هواتف معروضة حالياً",
      timeAgo: "منذ",
      logout: "تسجيل الخروج",
      deviceId: "معرف الجهاز (ID)",
      password: "كلمة المرور",
      toolType: "نوع الأداة المطلوبة",
      tabletModel: "موديل التابلت",
      notes: "ملاحظات إضافية",
      submitToolRequest: "إرسال طلب الأداة",
      subscribersOnly: "هذه الصفحة مخصصة للمشتركين في الباقات فقط",
      viewPackages: "عرض الباقات المتاحة",
      availableTools: "الأدوات المتاحة في باقتك",
      pendingRequest: "طلبك قيد المراجعة",
      packageType: "نوع الباقة",
      price: "السعر",
      phoneNumber: "رقم الهاتف",
      requestDate: "تاريخ الطلب",
      paymentConfirmation: "سيتم تفعيل باقتك خلال 24 ساعة من تأكيد الدفع",
      phoneListingsTitle: "هي اعرض التليفونات",
      phoneListingsSubtitle: "تصفح الهواتف المعروضة للإصلاح أو أضف هاتفك",
      toolRequestTitle: "طلب أداة تقنية",
      toolRequestSubtitle: "احصل على الأدوات التقنية المتقدمة التي تحتاجها لحل مشاكل الأجهزة بسهولة وسرعة",
      
      
      adminPanel: "لوحة التحكم",
    },
    en: {
      welcome: "Welcome",
      subscribed: "Subscribed",
      notSubscribed: "Not Subscribed",
      daysRemaining: "days remaining",
      addPhone: "List Phone for Repair",
      makePhone: "Phone Listings",
      getTool: "Get Tool",
      phoneModel: "Phone Model",
      problemType: "Problem Type",
      description: "Problem Description",
      budget: "Expected Budget",
      location: "Location",
      createListing: "Post Request",
      noPhones: "No phones listed currently",
      timeAgo: "ago",
      logout: "Logout",
      deviceId: "Device ID",
      password: "Password",
      toolType: "Tool Type",
      tabletModel: "Tablet Model",
      notes: "Additional Notes",
      submitToolRequest: "Submit Tool Request",
      subscribersOnly: "This page is for package subscribers only",
      viewPackages: "View Available Packages",
      availableTools: "Available Tools in Your Package",
      pendingRequest: "Your request is pending",
      packageType: "Package Type",
      price: "Price",
      phoneNumber: "Phone Number",
      requestDate: "Request Date",
      paymentConfirmation: "Your package will be activated within 24 hours of payment confirmation",
      phoneListingsTitle: "Phone Listings",
      phoneListingsSubtitle: "Browse phones listed for repair or add your phone",
      toolRequestTitle: "Technical Tool Request",
      toolRequestSubtitle: "Get the advanced technical tools you need to solve device problems easily and quickly",
      subscriberRequest: "Subscriber Tool Request",
      nonSubscriberRequest: "Non-Subscriber Tool Request",
      adminPanel: "Admin Panel",
    },
  }

  const currentContent = content[language]

  const handleToolRequest = async () => {
    if (!toolRequest.deviceId || !toolRequest.password || !toolRequest.toolType) {
      setToolSubmitMessage("يرجى ملء جميع الحقول المطلوبة")
      setToolSubmitSuccess(false)
      return
    }

    if (toolRequest.toolType === "all_tablets_format" && !toolRequest.tabletModel) {
      setToolSubmitMessage("يرجى إدخال موديل التابلت")
      setToolSubmitSuccess(false)
      return
    }

    setIsSubmittingTool(true)
    try {
      // إرسال طلب الأداة عبر API - الاعتماد على Cookie HttpOnly بدلاً من Authorization من localStorage
      const res = await fetch("/api/tool-requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email,
          device_id: toolRequest.deviceId,
          password: toolRequest.password,
          tool_type: toolRequest.toolType,
          tablet_model: toolRequest.tabletModel,
          notes: toolRequest.notes,
          license_key: licenseData?.license_key,
          package_name: licenseData?.package_name,
        })
      })
      const result = await res.json()
      if (!result.success) {
        setToolSubmitMessage("حدث خطأ أثناء إرسال الطلب")
        setToolSubmitSuccess(false)
      } else {
        setToolSubmitMessage("تم إرسال طلبك بنجاح! سيتم معالجته قريباً")
        setToolSubmitSuccess(true)
        setToolRequest({
          deviceId: "",
          password: "",
          toolType: "",
          tabletModel: "",
          notes: "",
        })
      }
    } catch (error) {
      setToolSubmitMessage("حدث خطأ أثناء إرسال الطلب")
      setToolSubmitSuccess(false)
    }
    setIsSubmittingTool(false)

    setTimeout(() => {
      setToolSubmitMessage("")
    }, 5000)
  }

  const fetchUserData = async () => {
    try {
      // جلب بيانات المستخدم من localStorage
      let currentUser = null
      
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          currentUser = JSON.parse(userStr)
        }
      }

      // السماح بالمتابعة حتى لو لم توجد بيانات مستخدم في localStorage
      if (currentUser) {
        setUser(currentUser)
      }

      try {
        await updateExpiredToolRequestsAction()
      } catch (error) {
        // Handle error silently
      }

      setIsLoadingTools(true)
      try {
        const toolsResult = await getToolsAction()
        if (toolsResult.success) {
          setAvailableTools(toolsResult.tools)
        }
      } catch (error) {
        // Handle error silently
      }
      setIsLoadingTools(false)

      setIsLoadingActiveTools(true)
      try {
        const activeToolsResult = await getActiveToolRequestsAction(currentUser.email)
        if (activeToolsResult.success) {
          setActiveToolRequests(activeToolsResult.toolRequests)
        }
      } catch (error) {
        // Handle error silently
      }
      setIsLoadingActiveTools(false)

      // جلب رصيد المستخدم من API وليس مباشرة من Supabase
      
      try {
        const walletRes = await fetch("/api/wallet/balance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({})
        })
        const walletResult = await walletRes.json()

        if (walletResult.success) {
          setWalletBalance(walletResult.balance)
        } else {
          setWalletBalance(0)
        }
      } catch (error) {
        setWalletBalance(0)
      }

      try {
        const pendingResult = await checkUserPendingRequest(currentUser.email)
        if (pendingResult.hasPendingRequest) {
          setHasPendingRequest(true)
          setPendingRequest(pendingResult.request)
        }
      } catch (error) {
        // Handle error silently
      }

      // تحقق من الاشتراك عبر API وليس مباشرة من Supabase
      try {
        const licenseRes = await fetch("/api/license/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const licenseResult = await licenseRes.json()

        if (licenseResult.valid && licenseResult.license) {
          setLicenseData(licenseResult.license)
          const endDate = new Date(licenseResult.license.end_date)
          const now = new Date()
          const diffTime = endDate.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          setDaysRemaining(Math.max(0, diffDays))
        }
      } catch (error) {
        // Handle error silently
      }


      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchPhoneListings = async () => {
    try {
      const result = await getPhoneListingsAction()
      if (result.success) {
        setPhoneListings(result.listings)
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const handleCreatePhoneListing = async () => {
    if (!newPhoneRequest.phoneModel || !newPhoneRequest.problemType || !newPhoneRequest.description) {
      setSubmitMessage("يرجى ملء جميع الحقول المطلوبة")
      setSubmitSuccess(false)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPhoneListingAction({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        phone_model: newPhoneRequest.phoneModel,
        problem_type: newPhoneRequest.problemType,
        description: newPhoneRequest.description,
        budget: newPhoneRequest.budget,
        location: newPhoneRequest.location,
      })

      if (!result.success) {
        setSubmitMessage("حدث خطأ أثناء نشر الطلب")
        setSubmitSuccess(false)
      } else {
        setSubmitMessage("تم نشر طلبك بنجاح!")
        setSubmitSuccess(true)
        setNewPhoneRequest({
          phoneModel: "",
          problemType: "",
          description: "",
          budget: "",
          location: "",
        })
        setShowAddPhone(false)
        fetchPhoneListings()
      }
    } catch (error) {
      setSubmitMessage("حدث خطأ أثناء نشر الطلب")
      setSubmitSuccess(false)
    }
    setIsSubmitting(false)

    setTimeout(() => {
      setSubmitMessage("")
    }, 5000)
  }

  const handleLogout = async () => {
    await signOutAction()
    // تنظيف أي توكن قديم من التخزين المحلي
    try { if (typeof window !== "undefined") localStorage.removeItem("token") } catch {}
    router.push("/")
  }

  const getSubscriptionStatus = () => {

    if (!licenseData) return { text: currentContent.notSubscribed, color: "text-gray-400" }
    if (daysRemaining > 0) return { text: currentContent.subscribed, color: "text-green-400" }
    return { text: `منتهي الصلاحية (منذ ${Math.abs(daysRemaining)} يوم)`, color: "text-red-400" }
  }

  const getPackageType = () => {
    if (!licenseData) return "Basic"
    if (licenseData.package_name.includes("الكبيرة") || licenseData.package_name.includes("Premium")) return "Premium"
    if (licenseData.package_name.includes("المتوسطة") || licenseData.package_name.includes("Pro")) return "Pro"
    return "Basic"
  }

  const shouldShowTabletModel = () => {
    return getPackageType() === "Premium" && toolRequest.toolType === "all_tablets_format"
  }

  const getAvailableTools = () => {
    const packageType = getPackageType()

    if (packageType === "Basic") {
      return [
        { value: "unlock_tool", label: "UNLOCK TOOL" },
        { value: "cf_tool", label: "CF TOOL" },
        { value: "cheetah_tool", label: "Cheetah TOOL" },
      ]
    } else if (packageType === "Pro") {
      return [
        { value: "unlock_tool", label: "UNLOCK TOOL" },
        { value: "amttsm_tool", label: "AMTTSM TOOL" },
        { value: "cf_tool", label: "CF TOOL" },
        { value: "tfm_tool", label: "TFM TOOL" },
        { value: "cheetah_tool", label: "Cheetah TOOL" },
        { value: "global_unlocker_pro", label: "Global Unlocker Pro" },
      ]
    } else if (packageType === "Premium") {
      return [
        { value: "unlock_tool", label: "UNLOCK TOOL" },
        { value: "amttsm_tool", label: "AMTTSM TOOL" },
        { value: "cf_tool", label: "CF TOOL" },
        { value: "tfm_tool", label: "TFM TOOL" },
        { value: "cheetah_tool", label: "Cheetah TOOL" },
        { value: "global_unlocker_pro", label: "Global Unlocker Pro" },
        { value: "oxygen_forensics", label: "Oxygen Forensics" },
        { value: "all_tablets_format", label: "All Tablets Format" },
      ]
    }

    return []
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`
    return `${Math.floor(diffInMinutes / 1440)} يوم`
  }

  const fetchUserRequests = async (userEmail: string) => {


    if (!userEmail) {

      return
    }



    try {
      // جلب سجل الأدوات من API بدون توكن، فقط user_email
      const res = await fetch("/api/tool-requests/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: userEmail })
      })
      const result = await res.json()
      if (result.success && result.requests) {
        setUserRequests(result.requests)
      } else {
        setUserRequests([])
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchUserData()
      await fetchPhoneListings()
    }
    loadData()
  }, [])

  useEffect(() => {
    if (user?.email) {
      fetchUserRequests(user.email)
    }
  }, [user?.email])

  useEffect(() => {
    if (user && user.email === "admin@tooly.com") {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const handlePurchaseTool = async (tool: any) => {
    if (!user) return

    setIsPurchasingTool(true)
    try {
      const result = await purchaseToolAction(tool.name, user.email!, tool.price, tool.duration_hours)

      if (result.success) {
        setPurchaseMessage(result.message)
        // Refresh user data to update wallet balance and active tools
        await fetchUserData()
      } else {
        setPurchaseMessage(result.message)
      }
    } catch (error) {
      setPurchaseMessage("حدث خطأ أثناء شراء الأداة. حاول مرة أخرى.")
    } finally {
      setIsPurchasingTool(false)
    }
  }

  const calculateProgress = (request: any) => {
    if (!request.start_time || !request.end_time) {
      return { progress: 0, isActive: false, timeText: "غير محدد" }
    }

    const startTime = new Date(request.start_time).getTime()
    const endTime = new Date(request.end_time).getTime()
    const currentTime = new Date().getTime()

    const totalDuration = endTime - startTime
    const elapsed = currentTime - startTime

    if (currentTime < startTime) {
      return { progress: 0, isActive: true, timeText: "لم يبدأ بعد" }
    }

    if (currentTime >= endTime) {
      const durationHours = Math.round(totalDuration / (1000 * 60 * 60))
      return {
        progress: 100,
        isActive: false,
        timeText: `مدة الاشتراك كانت ${durationHours} ساعة`,
      }
    }

    const progress = Math.min((elapsed / totalDuration) * 100, 100)
    const remainingTime = endTime - currentTime
    const remainingHours = Math.ceil(remainingTime / (1000 * 60 * 60))
    const elapsedHours = Math.floor(elapsed / (1000 * 60 * 60))

    return {
      progress,
      isActive: true,
      timeText: `مضى ${elapsedHours} ساعة، متبقي ${remainingHours} ساعة`,
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/tooly-gsm-logo-new.png" alt="TOOLY GSM Logo" className="w-8 h-4 object-contain" />
                <h1 className="text-xl font-bold text-white">TOOLY GSM</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-right">
                  <p className="text-xs text-green-100">المحفظة</p>
                  <p className="text-sm font-bold text-white">{walletBalance} جنيه</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{user?.email?.split("@")[0]}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`text-sm ${getSubscriptionStatus().color}`}>{getSubscriptionStatus().text}</span>
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">{getPackageType()}</span>
                    {licenseData && (
                      <span className="text-xs text-gray-400">
                        {daysRemaining} {currentContent.daysRemaining}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("ar")}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    language === "ar" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  عربي
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    language === "en" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex" dir="ltr">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen">
          <nav className="p-4">
            {/* Navigation Menu */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection("information")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === "information"
                    ? "bg-accent text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Info className="w-5 h-5" />
                <span>المعلومات</span>
              </button>

              <button
                onClick={() => setActiveSection("make-phone")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === "make-phone"
                    ? "bg-accent text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>{currentContent.makePhone}</span>
              </button>

              <button
                onClick={() => setActiveSection("view-records")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === "view-records"
                    ? "bg-accent text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>عرض السجل</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveSection("admin")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSection === "admin"
                      ? "bg-accent text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>{currentContent.adminPanel}</span>
                </button>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === "make-phone" && (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-8 shadow-2xl">
                  <Smartphone className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  COMING SOON
                </h1>
                <p className="text-gray-400 text-xl max-w-md mx-auto">
                  قسم عرض التليفونات قيد التطوير وسيكون متاحاً قريباً
                </p>
              </div>
            </div>
          )}

          {/* Tool Request for Non-Subscribers */}
          {/* قسم طلب أداة للغير مشتركين تم حذفه بالكامل بناءً على طلب المستخدم */}

          {/* قسم طلب أداة للمشتركين تم حذفه بالكامل بناءً على طلب المستخدم */}

          {activeSection === "view-records" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">سجل طلباتك</h2>
                <p className="text-gray-300">عرض جميع طلبات الأدوات السابقة</p>
              </div>

              <div className="space-y-4">
                {userRequests.length > 0 ? (
                  userRequests.map((request) => {
                    const { progress, isActive, timeText } = calculateProgress(request)

                    return (
                      <div
                        key={request.id}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold text-lg">{request.tool_name || "أداة غير محددة"}</h3>
                          <div className="text-right">
                            <span className="text-orange-400 font-bold text-lg">
                              {request.price ? `${request.price} جنيه` : "مجاني"}
                            </span>
                            {request.purchase_type && (
                              <p className="text-gray-400 text-sm">
                                {request.purchase_type === "subscription"
                                  ? "عن طريق الباقة"
                                  : request.purchase_type === "credit"
                                    ? "عن طريق الكريدت"
                                    : request.purchase_type}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ease-out ${
                                isActive ? "bg-green-400" : "bg-orange-400"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{timeText}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-400" : "bg-orange-400"}`} />
                            <span className="text-gray-400">{request.status_ar || (isActive ? "نشط" : "منتهي")}</span>
                          </div>
                        </div>

                        {request.notes && request.notes !== "EMPTY" && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <span className="text-gray-400 text-sm">ملاحظات: </span>
                            <span className="text-white text-sm">{request.notes}</span>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">لا توجد طلبات سابقة</p>
                    <p className="text-gray-400">ستظهر طلباتك هنا بعد إرسالها</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "information" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">المعلومات</h2>
                <p className="text-gray-300">معلومات عن النظام والخدمات المتاحة</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* معلومات المستخدم */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      معلومات المستخدم
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">البريد الإلكتروني:</span>
                      <span className="text-white">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">حالة الاشتراك:</span>
                      <span className={`${getSubscriptionStatus().color}`}>
                        {getSubscriptionStatus().text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">نوع الباقة:</span>
                      <span className="text-orange-400">{getPackageType()}</span>
                    </div>
                    {licenseData && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">الأيام المتبقية:</span>
                        <span className="text-white">{daysRemaining} يوم</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">رصيد المحفظة:</span>
                      <span className="text-green-400">{walletBalance} جنيه</span>
                    </div>
                  </CardContent>
                </Card>

                {/* معلومات النظام */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      معلومات النظام
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">عنوان IP:</span>
                      <span className="text-white">{userIp || "جاري التحميل..."}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">الطلبات النشطة:</span>
                      <span className="text-white">{activeToolRequests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">إجمالي الطلبات:</span>
                      <span className="text-white">{userRequests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">الهواتف المعروضة:</span>
                      <span className="text-white">{phoneListings.length}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* الأدوات المتاحة */}
                <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      الأدوات المتاحة في باقتك
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getAvailableTools().map((tool, index) => (
                        <div
                          key={index}
                          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-orange-500" />
                            <span className="text-white text-sm">{tool.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {getAvailableTools().length === 0 && (
                      <p className="text-gray-400 text-center py-4">
                        لا توجد أدوات متاحة. يرجى الاشتراك في إحدى الباقات.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* معلومات إضافية */}
                <Card className="bg-gray-900 border-gray-800 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      معلومات إضافية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-blue-400 font-semibold mb-2">نصائح للاستخدام</h4>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• تأكد من إدخال معرف الجهاز بشكل صحيح</li>
                            <li>• يمكنك تتبع حالة طلباتك في قسم "عرض السجل"</li>
                            <li>• رصيد المحفظة يمكن استخدامه لشراء أدوات إضافية</li>
                            <li>• للدعم الفني، يرجى التواصل معنا</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "admin" && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Admin Panel</h2>
              <p className="text-gray-300">This section is only visible to admins.</p>
              {/* Add admin-specific content here */}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
