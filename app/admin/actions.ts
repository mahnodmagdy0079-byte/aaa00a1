"use server"

import { createAdminClient } from "@/lib/supabase/server"

interface PurchaseRequest {
  id: string
  user_email: string
  package_name: string
  package_price: string
  package_period: string
  currency: string
  phone_number: string
  status: string
  created_at: string
  updated_at: string
}

interface UserWallet {
  id: string
  user_id: string
  user_email: string
  balance: number
  created_at: string
  updated_at: string
}

interface WalletTransaction {
  id: string
  wallet_id: string
  user_email: string
  amount: number
  transaction_type: string
  description: string
  admin_email: string | null
  created_at: string
}

interface Tool {
  id: string
  name: string
  image_url: string
  price: number
  duration_hours: number
  requires_credit: boolean
  tool_accounts: { count: number }[]
}

interface ToolAccount {
  id: string
  tool_name: string
  account_username: string
  account_password: string
  notes: string
  is_available: boolean
}

export async function loadRegisteredUsers() {


  const supabase = await createAdminClient()

  // Fetch users from the users table
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })



  if (usersError) {

    return { users: [], error: usersError.message }
  }

  // For each user, check if they have an active license and wallet balance
  const usersWithLicenseStatus = await Promise.all(
    (users || []).map(async (user) => {
      const { data: license } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_name", user.full_name)
        .gte("end_date", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      const { data: wallet } = await supabase
        .from("user_wallets")
        .select("balance")
        .eq("user_email", user.email)
        .maybeSingle()

      return {
        ...user,
        hasActiveLicense: !!license,
        licenseInfo: license,
        walletBalance: wallet?.balance || 0,
      }
    }),
  )



  return { users: usersWithLicenseStatus, error: null }
}

export async function addUserCredit(userEmail: string, amount: number, description = "Admin credit addition") {


  const supabase = await createAdminClient()

  try {
    // Call the database function to add credit
    const { data, error } = await supabase.rpc("add_wallet_credit", {
      p_user_email: userEmail,
      p_amount: amount,
      p_description: description,
      p_admin_email: "admin@system.com", // You can get this from auth context if needed
    })

    if (error) {

      return { success: false, error: error.message }
    }


    return { success: true }
  } catch (error) {

    return { success: false, error: "Failed to add credit" }
  }
}

export async function getUserWalletBalance(userEmail: string) {


  const supabase = await createAdminClient()

  const { data: wallet, error } = await supabase
    .from("user_wallets")
    .select("balance")
    .eq("user_email", userEmail)
    .maybeSingle()

  if (error) {

    return { balance: 0, error: error.message }
  }

  return { balance: wallet?.balance || 0, error: null }
}

export async function getUserWalletTransactions(userEmail: string) {


  const supabase = await createAdminClient()

  const { data: transactions, error } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {

    return { transactions: [], error: error.message }
  }

  return { transactions: transactions || [], error: null }
}

export async function loadPurchaseRequests() {


  const supabase = await createAdminClient()

  const { data: requests, error } = await supabase
    .from("purchase_requests")
    .select("*")
    .order("created_at", { ascending: false })



  if (error) {

    return { requests: [], error: error.message }
  }

  return { requests: requests || [], error: null }
}

export async function updatePurchaseRequestStatus(requestId: string, status: string) {


  const supabase = await createAdminClient()

  const { data: purchaseRequest, error: fetchError } = await supabase
    .from("purchase_requests")
    .select("*")
    .eq("id", requestId)
    .single()

  if (fetchError || !purchaseRequest) {

    return { success: false, error: "Purchase request not found" }
  }

  const { error } = await supabase.from("purchase_requests").update({ status }).eq("id", requestId)

  if (error) {

    return { success: false, error: error.message }
  }

  if (status === "approved") {


    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", purchaseRequest.user_email)
      .single()

    if (userError || !user) {

      return { success: false, error: "User not found for this email" }
    }

    // Check if user already has an active license
    const { data: existingLicense } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_name", user.full_name)
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingLicense) {

      // Extend existing license
      const currentEndDate = new Date(existingLicense.end_date)
      const packageDuration = getPackageDuration(purchaseRequest.package_name)
      const newEndDate = new Date(currentEndDate)
      newEndDate.setDate(currentEndDate.getDate() + packageDuration)

      const { error: updateError } = await supabase
        .from("licenses")
        .update({
          package_name: purchaseRequest.package_name,
          package_price: purchaseRequest.package_price,
          end_date: newEndDate.toISOString(),
        })
        .eq("id", existingLicense.id)

      if (updateError) {

        return { success: false, error: "Failed to extend existing license" }
      }


      return { success: true, licenseKey: existingLicense.license_key }
    } else {
      // Create new license
      const licenseKey = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join(
        "-",
      )

      const packageDuration = getPackageDuration(purchaseRequest.package_name)
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + packageDuration)

      const licenseData = {
        license_key: licenseKey,
        user_name: user.full_name,
        phone_number: purchaseRequest.phone_number,
        package_name: purchaseRequest.package_name,
        package_price: purchaseRequest.package_price,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      }



      const { error: licenseError } = await supabase.from("licenses").insert(licenseData)

      if (licenseError) {

        return { success: false, error: "Failed to create license: " + licenseError.message }
      }


      return { success: true, licenseKey }
    }
  }

  return { success: true }
}

export async function assignPackageToUser(userId: string, packageType: string) {


  const supabase = await createAdminClient()

  // Get user details
  const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()



  if (userError || !user) {

    return { success: false, error: "User not found" }
  }

  const { data: existingLicense, error: licenseCheckError } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_name", user.full_name)
    .gte("end_date", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()



  if (existingLicense) {

    return await updateUserPackage(userId, packageType)
  }

  // Generate license key
  const licenseKey = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join("-")



  // Set package details based on type
  const packageDetails = {
    small: { name: "الباقة الصغيرة", price: "100 جنيه", duration: 7 },
    medium: { name: "الباقة المتوسطة", price: "400 جنيه", duration: 30 },
    large: { name: "الباقة الكبيرة", price: "600 جنيه", duration: 30 },
  }

  const selectedPackage = packageDetails[packageType as keyof typeof packageDetails]

  if (!selectedPackage) {

    return { success: false, error: "Invalid package type" }
  }



  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + selectedPackage.duration)

  const licenseData = {
    license_key: licenseKey,
    user_name: user.full_name,
    user_email: user.email, // Added real user email instead of placeholder
    user_id: user.id, // Added user ID for proper linking
    phone_number: user.phone || "",
    package_name: selectedPackage.name,
    package_price: selectedPackage.price,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  }



  const { data: insertedLicense, error: licenseError } = await supabase
    .from("licenses")
    .insert(licenseData)
    .select()
    .single()



  if (licenseError) {

    return { success: false, error: licenseError.message }
  }


  return { success: true, licenseKey }
}

export async function updateUserPackage(userId: string, packageType: string) {


  const supabase = await createAdminClient()

  // Get user details
  const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

  if (!user) {
    return { success: false, error: "User not found" }
  }

  // Find existing license
  const { data: existingLicense } = await supabase.from("licenses").select("*").eq("user_name", user.full_name).single()

  if (!existingLicense) {
    return { success: false, error: "No existing license found" }
  }

  // Set package details based on type
  const packageDetails = {
    small: { name: "الباقة الصغيرة", price: "100 جنيه", duration: 7 },
    medium: { name: "الباقة المتوسطة", price: "400 جنيه", duration: 30 },
    large: { name: "الباقة الكبيرة", price: "600 جنيه", duration: 30 },
  }

  const selectedPackage = packageDetails[packageType as keyof typeof packageDetails]

  if (!selectedPackage) {
    return { success: false, error: "Invalid package type" }
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + selectedPackage.duration)

  // Update existing license
  const { error: updateError } = await supabase
    .from("licenses")
    .update({
      package_name: selectedPackage.name,
      package_price: selectedPackage.price,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })
    .eq("id", existingLicense.id)

  if (updateError) {

    return { success: false, error: updateError.message }
  }

  return { success: true, licenseKey: existingLicense.license_key }
}

export async function deleteUserPackage(userId: string) {


  const supabase = await createAdminClient()

  // Get user details
  const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

  if (!user) {
    return { success: false, error: "User not found" }
  }

  // Delete license
  const { error: deleteError } = await supabase.from("licenses").delete().eq("user_name", user.full_name)

  if (deleteError) {

    return { success: false, error: deleteError.message }
  }

  return { success: true }
}

export async function fetchAdminStats() {


  const supabase = await createAdminClient()

  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (usersError) {

    }

    // Get active licenses count
    const { count: activeLicenses, error: licensesError } = await supabase
      .from("licenses")
      .select("*", { count: "exact", head: true })
      .gte("end_date", new Date().toISOString())

    if (licensesError) {

    }

    // Get pending purchase requests count
    const { count: pendingRequests, error: requestsError } = await supabase
      .from("purchase_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (requestsError) {

    }

    // Get total phone listings count
    const { count: totalListings, error: listingsError } = await supabase
      .from("phone_listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    if (listingsError) {

    }

    const stats = {
      totalUsers: totalUsers || 0,
      activeLicenses: activeLicenses || 0,
      pendingRequests: pendingRequests || 0,
      totalListings: totalListings || 0,
    }



    return { stats, error: null }
  } catch (error) {

    return {
      stats: { totalUsers: 0, activeLicenses: 0, pendingRequests: 0, totalListings: 0 },
      error: "Failed to fetch statistics",
    }
  }
}

export async function checkUserPendingRequest(userEmail: string) {


  const supabase = await createAdminClient()

  const { data: pendingRequest, error } = await supabase
    .from("purchase_requests")
    .select("*")
    .eq("user_email", userEmail)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()



  if (error) {

    return { hasPendingRequest: false, request: null, error: error.message }
  }

  return {
    hasPendingRequest: !!pendingRequest,
    request: pendingRequest,
    error: null,
  }
}

export async function loadToolRequests() {


  const supabase = await createAdminClient()

  const { data: requests, error } = await supabase
    .from("tool_requests")
    .select("*")
    .order("created_at", { ascending: false })



  if (error) {

    return { requests: [], error: error.message }
  }

  return { requests: requests || [], error: null }
}

export async function purchaseToolWithCredits(
  userEmail: string,
  toolName: string,
  toolPrice: number,
  durationHours: number,
  requiresCredit = true,
) {

  const supabase = await createAdminClient()

  try {
    // Call the database function to purchase tool
    const { data, error } = await supabase.rpc("purchase_tool_with_credits", {
      p_user_email: userEmail,
      p_tool_name: toolName,
      p_tool_price: toolPrice,
      p_duration_hours: durationHours,
      p_requires_credit: requiresCredit,
    })

    if (error) {

      return { success: false, error: error.message }
    }


    return data
  } catch (error) {

    return { success: false, error: "Failed to purchase tool" }
  }
}

export async function activateToolRequest(requestId: string, actualAccount: string, success = true) {


  const supabase = await createAdminClient()

  try {
    if (success) {
      // Get the request details to calculate activation times
      const { data: request, error: fetchError } = await supabase
        .from("tool_requests")
        .select("*")
        .eq("id", requestId)
        .single()

      if (fetchError || !request) {

        return { success: false, error: "Tool request not found" }
      }

      const activationStart = new Date()
      const activationEnd = new Date()
      activationEnd.setHours(activationStart.getHours() + request.duration_hours)

      // Update request as active with account details
      const { error: updateError } = await supabase
        .from("tool_requests")
        .update({
          status: "active",
          actual_account: actualAccount,
          activation_start: activationStart.toISOString(),
          activation_end: activationEnd.toISOString(),
        })
        .eq("id", requestId)

      if (updateError) {

        return { success: false, error: updateError.message }
      }


      return { success: true, activationEnd: activationEnd.toISOString() }
    } else {
      // Mark request as failed and refund user
      const { data: request, error: fetchError } = await supabase
        .from("tool_requests")
        .select("*")
        .eq("id", requestId)
        .single()

      if (fetchError || !request) {
        return { success: false, error: "Tool request not found" }
      }

      // Refund the user
      await supabase.rpc("add_wallet_credit", {
        p_user_email: request.user_email,
        p_amount: request.tool_price,
        p_description: `استرداد فشل تفعيل أداة: ${request.tool_name}`,
        p_admin_email: "system@auto",
      })

      // Update request as failed
      const { error: updateError } = await supabase
        .from("tool_requests")
        .update({ status: "failed" })
        .eq("id", requestId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return { success: true, refunded: true }
    }
  } catch (error) {

    return { success: false, error: "Failed to activate tool request" }
  }
}

export async function getUserActiveToolRequests(userEmail: string) {


  const supabase = await createAdminClient()

  // First expire any outdated requests
  await supabase.rpc("expire_tool_requests")

  const { data: requests, error } = await supabase
    .from("tool_requests")
    .select("*")
    .eq("user_email", userEmail)
    .in("status", ["pending", "active"])
    .order("created_at", { ascending: false })

  if (error) {

    return { requests: [], error: error.message }
  }

  return { requests: requests || [], error: null }
}

export async function purchasePackageWithCredits(userEmail: string, packageType: string) {


  const supabase = await createAdminClient()

  try {
    // Get package details
    const packageDetails = {
      small: { name: "الباقة الصغيرة", price: 100, duration: 7 },
      medium: { name: "الباقة المتوسطة", price: 400, duration: 30 },
      large: { name: "الباقة الكبيرة", price: 600, duration: 30 },
    }

    const selectedPackage = packageDetails[packageType as keyof typeof packageDetails]

    if (!selectedPackage) {
      return { success: false, error: "Invalid package type" }
    }

    // Check user's wallet balance
    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("balance")
      .eq("user_email", userEmail)
      .maybeSingle()

    const currentBalance = wallet?.balance || 0

    if (currentBalance < selectedPackage.price) {
      return {
        success: false,
        error: "insufficient_balance",
        message: "رصيد غير كافي لشراء هذه الباقة",
        required: selectedPackage.price,
        available: currentBalance,
      }
    }

    // Deduct amount from wallet
    await supabase.rpc("add_wallet_credit", {
      p_user_email: userEmail,
      p_amount: -selectedPackage.price,
      p_description: `شراء ${selectedPackage.name}`,
      p_admin_email: "system@auto",
    })

    // Get user details for license creation
    const { data: user } = await supabase.from("users").select("*").eq("email", userEmail).single()

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Create or extend license
    const { data: existingLicense } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_name", user.full_name)
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    const startDate = new Date()
    const endDate = new Date()

    if (existingLicense) {
      // Extend existing license
      const currentEndDate = new Date(existingLicense.end_date)
      endDate.setTime(currentEndDate.getTime() + selectedPackage.duration * 24 * 60 * 60 * 1000)

      const { error: updateError } = await supabase
        .from("licenses")
        .update({
          package_name: selectedPackage.name,
          package_price: `${selectedPackage.price} جنيه`,
          end_date: endDate.toISOString(),
        })
        .eq("id", existingLicense.id)

      if (updateError) {
        return { success: false, error: "Failed to extend license" }
      }

      return { success: true, extended: true, endDate: endDate.toISOString() }
    } else {
      // Create new license
      endDate.setDate(startDate.getDate() + selectedPackage.duration)

      const licenseKey = Array.from({ length: 4 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join(
        "-",
      )

      const { error: createError } = await supabase.from("licenses").insert({
        license_key: licenseKey,
        user_name: user.full_name,
        phone_number: user.phone || "",
        package_name: selectedPackage.name,
        package_price: `${selectedPackage.price} جنيه`,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

      if (createError) {
        return { success: false, error: "Failed to create license" }
      }

      return { success: true, created: true, licenseKey, endDate: endDate.toISOString() }
    }
  } catch (error) {

    return { success: false, error: "Failed to purchase package" }
  }
}

function getPackageDuration(packageName: string): number {
  const packageDurations: { [key: string]: number } = {
    "الباقة الصغيرة": 7, // 7 days
    "الباقة المتوسطة": 30, // 30 days
    "الباقة الكبيرة": 30, // 30 days
    "Small Plan": 7,
    "Medium Plan": 30,
    "Large Plan": 30,
  }

  return packageDurations[packageName] || 30 // Default to 30 days
}

export async function loadTools() {


  const supabase = await createAdminClient()

  // First, get all tools
  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false })

  if (toolsError) {

    return { tools: [], error: toolsError.message }
  }

  // Then, get account counts for each tool
  const toolsWithCount = await Promise.all(
    (tools || []).map(async (tool) => {
      const { count, error: countError } = await supabase
        .from("tool_accounts")
        .select("*", { count: "exact", head: true })
        .eq("tool_name", tool.name)

      if (countError) {

      }

      return {
        ...tool,
        accounts_count: count || 0,
      }
    }),
  )


  return { tools: toolsWithCount, error: null }
}

export async function addTool(toolData: {
  name: string
  image_url: string
  price: number
  duration_hours: number
  requires_credit: boolean
}) {


  const supabase = await createAdminClient()

  const { error } = await supabase.from("tools").insert(toolData)

  if (error) {

    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateTool(
  toolId: string,
  toolData: {
    name: string
    image_url: string
    price: number
    duration_hours: number
    requires_credit: boolean
  },
) {


  const supabase = await createAdminClient()

  const { error } = await supabase.from("tools").update(toolData).eq("id", toolId)

  if (error) {

    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteTool(toolId: string) {


  const supabase = await createAdminClient()

  // First delete all accounts for this tool
  await supabase.from("tool_accounts").delete().eq("tool_name", toolId)

  // Then delete the tool
  const { error } = await supabase.from("tools").delete().eq("id", toolId)

  if (error) {

    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function loadToolAccounts(toolId: string) {


  const supabase = await createAdminClient()

  const { data: tool } = await supabase.from("tools").select("name").eq("id", toolId).single()

  if (!tool) {
    return { accounts: [], error: "Tool not found" }
  }

  const { data: accounts, error } = await supabase
    .from("tool_accounts")
    .select("*")
    .eq("tool_name", tool.name)
    .order("created_at", { ascending: false })

  if (error) {

    return { accounts: [], error: error.message }
  }

  return { accounts: accounts || [], error: null }
}

export async function addToolAccount(
  toolId: string,
  accountData: {
    username: string
    password: string
    notes: string
  },
) {


  const supabase = await createAdminClient()

  const { data: tool } = await supabase.from("tools").select("name").eq("id", toolId).single()

  if (!tool) {
    return { error: "Tool not found" }
  }

  const { error } = await supabase.from("tool_accounts").insert({
    tool_name: tool.name,
    account_username: accountData.username,
    account_password: accountData.password,
    notes: accountData.notes,
    is_available: true,
  })

  if (error) {

    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteToolAccount(accountId: string) {


  const supabase = await createAdminClient()

  const { error } = await supabase.from("tool_accounts").delete().eq("id", accountId)

  if (error) {

    return { success: false, error: error.message }
  }

  return { success: true }
}
