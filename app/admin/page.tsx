"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Settings,
  Users,
  Package,
  BarChart3,
  Bell,
  CreditCard,
  Edit,
  Trash,
  Plus,
  Wallet,
  Wrench,
  Eye,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  loadRegisteredUsers as loadUsersAction,
  fetchAdminStats,
  assignPackageToUser,
  addUserCredit,
  addTool,
  deleteTool,
  loadToolAccounts,
  addToolAccount,
  deleteToolAccount,
  loadTools as loadToolsAction,
} from "./actions"

interface UserWithLicense {
  id: string
  email: string
  full_name: string
  phone: string
  created_at: string
  updated_at: string
  hasActiveLicense: boolean
  walletBalance: number // Added wallet balance to user interface
  licenseInfo: {
    id: string
    license_key: string
    package_name: string
    package_price: string
    start_date: string
    end_date: string
  } | null
}

interface AdminStats {
  totalUsers: number
  activeLicenses: number
  pendingRequests: number
  totalListings: number
}

interface Tool {
  id: string
  name: string
  image_url: string
  price: number
  duration_hours: number
  requires_credit: boolean
  accounts_count: number
}

interface ToolAccount {
  id: string
  username: string
  password: string
  notes: string
  is_active: boolean
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState("small")
  const [generatedLicense, setGeneratedLicense] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedLicenses, setSavedLicenses] = useState<any[]>([])
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false)
  const [userName, setUserName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeLicenses: 0,
    pendingRequests: 0,
    totalListings: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [userDetails, setUserDetails] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [registeredUsers, setRegisteredUsers] = useState<UserWithLicense[]>([])
  const [isLoadingRegisteredUsers, setIsLoadingRegisteredUsers] = useState(false)
  const [selectedUserForLicense, setSelectedUserForLicense] = useState<string>("")
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<string>("")
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<string>("")
  const [assignPackageType, setAssignPackageType] = useState("small")
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedUserForAssign, setSelectedUserForAssign] = useState<string>("")

  const [showCreditModal, setShowCreditModal] = useState(false)
  const [selectedUserForCredit, setSelectedUserForCredit] = useState<string>("")
  const [creditAmount, setCreditAmount] = useState<string>("")
  const [creditDescription, setCreditDescription] = useState<string>("")
  const [isAddingCredit, setIsAddingCredit] = useState(false)

  const [showDeductModal, setShowDeductModal] = useState(false)
  const [selectedUserForDeduct, setSelectedUserForDeduct] = useState<string>("")
  const [deductAmount, setDeductAmount] = useState<string>("")
  const [deductDescription, setDeductDescription] = useState<string>("")
  const [isDeductingCredit, setIsDeductingCredit] = useState(false)

  // Tool management state variables
  const [tools, setTools] = useState<any[]>([])
  const [isLoadingTools, setIsLoadingTools] = useState(false)
  const [showAddToolModal, setShowAddToolModal] = useState(false)
  const [showEditToolModal, setShowEditToolModal] = useState(false)
  const [showToolAccountsModal, setShowToolAccountsModal] = useState(false)
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const [toolAccounts, setToolAccounts] = useState<any[]>([])
  const [isLoadingToolAccounts, setIsLoadingToolAccounts] = useState(false)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)

  // Tool form state
  const [toolForm, setToolForm] = useState({
    name: "",
    image_url: "",
    price: "",
    duration_hours: "",
    requires_credit: true,
  })

  // Account form state
  const [accountForm, setAccountForm] = useState({
    username: "",
    password: "",
    notes: "",
  })

  useEffect(() => {
    // Load initial data
    loadStats()
    loadRegisteredUsers()
  }, [])

  const loadStats = async () => {
    console.log("[v0] Loading admin stats...")
    setIsLoadingStats(true)

    try {
      const result = await fetchAdminStats()

      console.log("[v0] Admin stats result:", result)

      if (result.error) {
        console.error("Error loading admin stats:", result.error)
        return
      }

      setStats(result.stats)
    } catch (error) {
      console.error("Error loading admin stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const loadRegisteredUsers = async () => {
    console.log("[v0] Loading registered users...")
    setIsLoadingRegisteredUsers(true)

    try {
      const result = await loadUsersAction()

      console.log("[v0] Registered users result:", result)

      if (result.error) {
        console.error("Error loading registered users:", result.error)
        return
      }

      setRegisteredUsers(result.users)
    } catch (error) {
      console.error("Error loading registered users:", error)
    } finally {
      setIsLoadingRegisteredUsers(false)
    }
  }

  const loadTools = async () => {
    console.log("[v0] Loading tools...")
    setIsLoadingTools(true)

    try {
      const result = await loadToolsAction()

      if (result.error) {
        console.error("Error loading tools:", result.error)
        return
      }

      setTools(result.tools)
    } catch (error) {
      console.error("Error loading tools:", error)
    } finally {
      setIsLoadingTools(false)
    }
  }

  const loadToolAccountsForTool = async (toolId: string) => {
    console.log("[v0] Loading tool accounts for tool:", toolId)
    setIsLoadingToolAccounts(true)

    try {
      const result = await loadToolAccounts(toolId)

      if (result.error) {
        console.error("Error loading tool accounts:", result.error)
        return
      }

      setToolAccounts(result.accounts)
    } catch (error) {
      console.error("Error loading tool accounts:", error)
    } finally {
      setIsLoadingToolAccounts(false)
    }
  }

  const handleAssignPackage = async (userId: string) => {
    try {
      const result = await assignPackageToUser(userId, assignPackageType)

      if (result.success) {
        alert(`تم تعيين الباقة بنجاح! مفتاح الترخيص: ${result.licenseKey}`)
        loadRegisteredUsers() // Refresh the list
        setShowAssignModal(false) // Close modal
      } else {
        alert(`حدث خطأ في تعيين الباقة: ${result.error}`)
      }
    } catch (error) {
      console.error("Error assigning package:", error)
      alert("حدث خطأ في تعيين الباقة")
    }
  }

  const handleAddCredit = async () => {
    if (!creditAmount || Number.parseFloat(creditAmount) <= 0) {
      alert("يرجى إدخال مبلغ صحيح")
      return
    }

    setIsAddingCredit(true)
    try {
      const user = registeredUsers.find((u) => u.id === selectedUserForCredit)
      if (!user) {
        alert("المستخدم غير موجود")
        return
      }

      const result = await addUserCredit(
        user.email,
        Number.parseFloat(creditAmount),
        creditDescription || "إضافة رصيد من الإدارة",
      )

      if (result.success) {
        alert(`تم إضافة ${creditAmount} جنيه إلى محفظة المستخدم بنجاح`)
        loadRegisteredUsers() // Refresh the list
        setShowCreditModal(false)
        setCreditAmount("")
        setCreditDescription("")
      } else {
        alert(`حدث خطأ في إضافة الرصيد: ${result.error}`)
      }
    } catch (error) {
      console.error("Error adding credit:", error)
      alert("حدث خطأ في إضافة الرصيد")
    } finally {
      setIsAddingCredit(false)
    }
  }

  const handleDeductCredit = async () => {
    if (!deductAmount || Number.parseFloat(deductAmount) <= 0) {
      alert("يرجى إدخال مبلغ صحيح")
      return
    }

    setIsDeductingCredit(true)
    try {
      const user = registeredUsers.find((u) => u.id === selectedUserForDeduct)
      if (!user) {
        alert("المستخدم غير موجود")
        return
      }

      // Check if user has sufficient balance
      if (user.walletBalance < Number.parseFloat(deductAmount)) {
        alert("رصيد المستخدم غير كافي لهذا الخصم")
        return
      }

      const result = await addUserCredit(
        user.email,
        -Number.parseFloat(deductAmount), // Negative amount for deduction
        deductDescription || "خصم رصيد من الإدارة",
      )

      if (result.success) {
        alert(`تم خصم ${deductAmount} جنيه من محفظة المستخدم بنجاح`)
        loadRegisteredUsers() // Refresh the list
        setShowDeductModal(false)
        setDeductAmount("")
        setDeductDescription("")
      } else {
        alert(`حدث خطأ في خصم الرصيد: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deducting credit:", error)
      alert("حدث خطأ في خصم الرصيد")
    } finally {
      setIsDeductingCredit(false)
    }
  }

  const handleAddTool = async () => {
    if (!toolForm.name || !toolForm.price || !toolForm.duration_hours) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    try {
      const result = await addTool({
        name: toolForm.name,
        image_url: toolForm.image_url,
        price: Number.parseFloat(toolForm.price),
        duration_hours: Number.parseInt(toolForm.duration_hours),
        requires_credit: toolForm.requires_credit,
      })

      if (result.success) {
        alert("تم إضافة الأداة بنجاح")
        setShowAddToolModal(false)
        setToolForm({ name: "", image_url: "", price: "", duration_hours: "", requires_credit: true })
        loadTools()
      } else {
        alert(`حدث خطأ في إضافة الأداة: ${result.error}`)
      }
    } catch (error) {
      console.error("Error adding tool:", error)
      alert("حدث خطأ في إضافة الأداة")
    }
  }

  const handleAddAccount = async () => {
    if (!accountForm.username || !accountForm.password) {
      alert("يرجى ملء اسم المستخدم وكلمة المرور")
      return
    }

    try {
      const result = await addToolAccount(selectedTool.id, {
        username: accountForm.username,
        password: accountForm.password,
        notes: accountForm.notes,
      })

      if (result.success) {
        alert("تم إضافة الحساب بنجاح")
        setShowAddAccountModal(false)
        setAccountForm({ username: "", password: "", notes: "" })
        loadToolAccountsForTool(selectedTool.id)
      } else {
        alert(`حدث خطأ في إضافة الحساب: ${result.error}`)
      }
    } catch (error) {
      console.error("Error adding account:", error)
      alert("حدث خطأ في إضافة الحساب")
    }
  }

  const sidebarItems = [
    {
      icon: BarChart3,
      label: "لوحة التحكم",
      active: activeSection === "dashboard",
      onClick: () => setActiveSection("dashboard"),
    },
    {
      icon: Users,
      label: "المستخدمين",
      active: activeSection === "users",
      onClick: () => {
        setActiveSection("users")
        // Only load users if they haven't been loaded yet
        if (registeredUsers.length === 0 && !isLoadingRegisteredUsers) {
          loadRegisteredUsers()
        }
      },
    },
    {
      icon: Wrench,
      label: "الأدوات",
      active: activeSection === "tools",
      onClick: () => {
        setActiveSection("tools")
        // Only load tools if they haven't been loaded yet
        if (tools.length === 0 && !isLoadingTools) {
          loadTools()
        }
      },
    },
    {
      icon: Package,
      label: "الباقات",
      active: activeSection === "packages",
      onClick: () => setActiveSection("packages"),
    },
    {
      icon: Settings,
      label: "الإعدادات",
      active: activeSection === "settings",
      onClick: () => setActiveSection("settings"),
    },
  ]

  return (
    <div className="min-h-screen bg-black" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 z-20 flex-shrink-0 w-64 bg-gray-800 transition-all duration-300 ${sidebarOpen ? "lg:w-64" : "lg:w-0"}`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="flex items-center justify-center h-16 bg-gray-900">
              <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
            </div>
            {/* Sidebar links */}
            <nav className="flex-1 px-2 py-4 space-y-4">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 ${item.active ? "bg-gray-700" : ""}`}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Main content */}
        <main className={`flex-1 p-6 ${sidebarOpen ? "mr-64" : "mr-0"} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            {/* Dashboard section */}
            {activeSection === "dashboard" && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
                <p className="text-gray-400">نظرة عامة على الأداء العام</p>
                {/* Dashboard stats */}
                {isLoadingStats ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-sm text-gray-400 mt-2">جاري تحميل الإحصائيات...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                    {/* Total users */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Users className="w-5 h-5 text-blue-500" />
                          المستخدمين
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-2xl font-bold">{stats.totalUsers}</p>
                      </CardContent>
                    </Card>
                    {/* Active licenses */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Package className="w-5 h-5 text-green-500" />
                          الباقات النشطة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-2xl font-bold">{stats.activeLicenses}</p>
                      </CardContent>
                    </Card>
                    {/* Pending requests */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Bell className="w-5 h-5 text-red-500" />
                          الطلبات الجديدة
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-2xl font-bold">{stats.pendingRequests}</p>
                      </CardContent>
                    </Card>
                    {/* Total listings */}
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <CreditCard className="w-5 h-5 text-yellow-500" />
                          عروض الهواتف
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-2xl font-bold">{stats.totalListings}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Users section */}
            {activeSection === "users" && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">المستخدمين</h1>
                <p className="text-gray-400">إدارة المستخدمين والباقات والمحافظ</p>
                {isLoadingRegisteredUsers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-sm text-gray-400 mt-2">جاري تحميل المستخدمين...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">الاسم</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">البريد الإلكتروني</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">رقم الهاتف</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">رصيد المحفظة</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">الباقة</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">تاريخ انتهاء الباقة</th>
                          <th className="text-right py-3 px-4 text-gray-300 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800">
                            <td className="py-3 px-4 text-white font-medium">
                              {user.full_name?.split("@")[0] || "غير محدد"}
                            </td>
                            <td className="py-3 px-4 text-gray-300">{user.email}</td>
                            <td className="py-3 px-4 text-gray-300">{user.phone || "غير محدد"}</td>
                            <td className="py-3 px-4 text-yellow-400 font-medium">
                              {user.walletBalance?.toFixed(2) || "0.00"} جنيه
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {user.hasActiveLicense ? (
                                <span className="text-green-400">{user.licenseInfo?.package_name}</span>
                              ) : (
                                <span className="text-red-400">لا توجد باقة</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {user.hasActiveLicense && user.licenseInfo?.end_date ? (
                                new Date(user.licenseInfo.end_date).toLocaleDateString("ar-EG")
                              ) : (
                                <span className="text-gray-500">غير محدد</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserForCredit(user.id)
                                    setShowCreditModal(true)
                                  }}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                >
                                  <Wallet className="w-4 h-4 ml-1" />
                                  إضافة رصيد
                                </Button>

                                {!user.hasActiveLicense ? (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUserForAssign(user.id)
                                      setShowAssignModal(true)
                                    }}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    <Plus className="w-4 h-4 ml-1" />
                                    تعيين باقة
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedUserForCredit(user.id)
                                        setShowCreditModal(true)
                                      }}
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      <Edit className="w-4 h-4 ml-1" />
                                      تعديل
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedUserForDeduct(user.id)
                                        setShowDeductModal(true)
                                      }}
                                      className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                                    >
                                      <Trash className="w-4 h-4 ml-1" />
                                      خصم
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {registeredUsers.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400">لا توجد مستخدمين مسجلين</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tools management section */}
            {activeSection === "tools" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">إدارة الأدوات</h1>
                    <p className="text-gray-400">إضافة وتعديل الأدوات وحساباتها</p>
                  </div>
                  <Button
                    onClick={() => setShowAddToolModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة أداة جديدة
                  </Button>
                </div>

                {isLoadingTools ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-sm text-gray-400 mt-2">جاري تحميل الأدوات...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                      <Card key={tool.id} className="bg-gray-900 border-gray-700">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            {tool.image_url && (
                              <img
                                src={tool.image_url || "/placeholder.svg"}
                                alt={tool.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                              <p className="text-orange-400 font-bold">{tool.price} جنيه</p>
                              <p className="text-gray-400 text-sm">{tool.duration_hours} ساعة</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedTool(tool)
                                setShowToolAccountsModal(true)
                                loadToolAccountsForTool(tool.id)
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              الحسابات ({tool.accounts_count || 0})
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedTool(tool)
                                setToolForm({
                                  name: tool.name,
                                  image_url: tool.image_url || "",
                                  price: tool.price.toString(),
                                  duration_hours: tool.duration_hours.toString(),
                                  requires_credit: tool.requires_credit,
                                })
                                setShowEditToolModal(true)
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                              <Edit className="w-4 h-4 ml-1" />
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                if (confirm("هل أنت متأكد من حذف هذه الأداة؟")) {
                                  const result = await deleteTool(tool.id)
                                  if (result.success) {
                                    alert("تم حذف الأداة بنجاح")
                                    loadTools()
                                  } else {
                                    alert(`حدث خطأ في حذف الأداة: ${result.error}`)
                                  }
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash className="w-4 h-4 ml-1" />
                              حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {tools.length === 0 && !isLoadingTools && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">لا توجد أدوات مضافة</p>
                  </div>
                )}
              </div>
            )}

            {/* Packages section */}
            {activeSection === "packages" && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">الباقات</h1>
                <p className="text-gray-400">إدارة الباقات المتاحة</p>
                {/* Packages table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-right py-3 px-4 text-gray-300 font-medium">اسم الباقة</th>
                        <th className="text-right py-3 px-4 text-gray-300 font-medium">السعر</th>
                        <th className="text-right py-3 px-4 text-gray-300 font-medium">المدة</th>
                        <th className="text-right py-3 px-4 text-gray-300 font-medium">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>{/* Package rows */}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings section */}
            {activeSection === "settings" && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">الإعدادات</h1>
                <p className="text-gray-400">إدارة الإعدادات العامة</p>
                {/* Settings form */}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Tool management modals */}

      {/* Add Tool Modal */}
      {showAddToolModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">إضافة أداة جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">اسم الأداة:</label>
                <input
                  type="text"
                  value={toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  placeholder="مثال: UNLOCK TOOL"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">رابط الصورة:</label>
                <input
                  type="url"
                  value={toolForm.image_url}
                  onChange={(e) => setToolForm({ ...toolForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.png"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">السعر (بالجنيه):</label>
                <input
                  type="number"
                  value={toolForm.price}
                  onChange={(e) => setToolForm({ ...toolForm, price: e.target.value })}
                  placeholder="40"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">المدة (بالساعات):</label>
                <input
                  type="number"
                  value={toolForm.duration_hours}
                  onChange={(e) => setToolForm({ ...toolForm, duration_hours: e.target.value })}
                  placeholder="6"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  min="1"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-white text-sm">
                  <input
                    type="checkbox"
                    checked={toolForm.requires_credit}
                    onChange={(e) => setToolForm({ ...toolForm, requires_credit: e.target.checked })}
                    className="rounded"
                  />
                  يتطلب رصيد
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddTool} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  إضافة الأداة
                </Button>
                <Button
                  onClick={() => {
                    setShowAddToolModal(false)
                    setToolForm({ name: "", image_url: "", price: "", duration_hours: "", requires_credit: true })
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool Accounts Modal */}
      {showToolAccountsModal && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[600px] max-w-[90vw] mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">حسابات {selectedTool.name}</h3>
              <Button
                onClick={() => setShowAddAccountModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 ml-1" />
                إضافة حساب
              </Button>
            </div>

            {isLoadingToolAccounts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-sm text-gray-400 mt-2">جاري تحميل الحسابات...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {toolAccounts.map((account) => (
                  <div key={account.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">المستخدم: {account.username}</p>
                        <p className="text-gray-300">كلمة المرور: {account.password}</p>
                        {account.notes && <p className="text-gray-400 text-sm mt-1">ملاحظات: {account.notes}</p>}
                        <p className="text-gray-500 text-xs mt-2">الحالة: {account.is_active ? "متاح" : "مستخدم"}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (confirm("هل أنت متأكد من حذف هذا الحساب؟")) {
                            const result = await deleteToolAccount(account.id)
                            if (result.success) {
                              alert("تم حذف الحساب بنجاح")
                              loadToolAccountsForTool(selectedTool.id)
                            } else {
                              alert(`حدث خطأ في حذف الحساب: ${result.error}`)
                            }
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {toolAccounts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">لا توجد حسابات لهذه الأداة</p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => {
                  setShowToolAccountsModal(false)
                  setSelectedTool(null)
                  setToolAccounts([])
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">إضافة حساب جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">اسم المستخدم:</label>
                <input
                  type="text"
                  value={accountForm.username}
                  onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                  placeholder="username"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">كلمة المرور:</label>
                <input
                  type="text"
                  value={accountForm.password}
                  onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                  placeholder="password"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">ملاحظات (اختياري):</label>
                <textarea
                  value={accountForm.notes}
                  onChange={(e) => setAccountForm({ ...accountForm, notes: e.target.value })}
                  placeholder="ملاحظات إضافية"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddAccount} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  إضافة الحساب
                </Button>
                <Button
                  onClick={() => {
                    setShowAddAccountModal(false)
                    setAccountForm({ username: "", password: "", notes: "" })
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package assignment modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">اختر نوع الباقة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">نوع الباقة:</label>
                <select
                  value={assignPackageType}
                  onChange={(e) => setAssignPackageType(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                >
                  <option value="small">الباقة الصغيرة (100 جنيه - 7 أيام)</option>
                  <option value="medium">الباقة المتوسطة (400 جنيه - 30 يوم)</option>
                  <option value="large">الباقة الكبيرة (600 جنيه - 30 يوم)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleAssignPackage(selectedUserForAssign)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  تعيين الباقة
                </Button>
                <Button
                  onClick={() => setShowAssignModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">إضافة رصيد للمحفظة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">المبلغ (بالجنيه):</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">الوصف (اختياري):</label>
                <input
                  type="text"
                  value={creditDescription}
                  onChange={(e) => setCreditDescription(e.target.value)}
                  placeholder="سبب إضافة الرصيد"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddCredit}
                  disabled={isAddingCredit}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isAddingCredit ? "جاري الإضافة..." : "إضافة الرصيد"}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreditModal(false)
                    setCreditAmount("")
                    setCreditDescription("")
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">خصم رصيد من المحفظة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">المبلغ المراد خصمه (بالجنيه):</label>
                <input
                  type="number"
                  value={deductAmount}
                  onChange={(e) => setDeductAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">سبب الخصم (اختياري):</label>
                <input
                  type="text"
                  value={deductDescription}
                  onChange={(e) => setDeductDescription(e.target.value)}
                  placeholder="سبب خصم الرصيد"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDeductCredit}
                  disabled={isDeductingCredit}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  {isDeductingCredit ? "جاري الخصم..." : "خصم الرصيد"}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeductModal(false)
                    setDeductAmount("")
                    setDeductDescription("")
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
