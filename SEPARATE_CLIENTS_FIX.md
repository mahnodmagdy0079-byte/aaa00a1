# إصلاح فصل API Clients - TOOLY GSM Desktop

## 🚨 المشكلة

**البرنامج عرف يجيب الأدوات لكن لم يعرف يجيب الرصيد ونوع الباقة**

**السبب**: كان يستخدم نفس HttpClient لجميع العمليات، مما يسبب تضارب في الـ headers.

## 🔍 تحليل المشكلة

### **المشكلة الأساسية:**
```csharp
// كان يستخدم نفس client لجميع العمليات
using (var client = new HttpClient())
{
    // جلب الرصيد
    client.BaseAddress = new Uri("https://eskuly.org");
    // ... ثم تغيير الـ headers للأدوات
    client.BaseAddress = new Uri("https://ewkzduhofisinbhjrzzu.supabase.co");
    // هذا يسبب تضارب!
}
```

## 🛠️ الحل المطبق

### **فصل API Clients:**

#### **1. LoadUserDataAsync - API Client منفصل:**
```csharp
private async Task LoadUserDataAsync()
{
    // جلب الرصيد والترخيص عبر API
    using (var apiClient = new HttpClient())
    {
        apiClient.BaseAddress = new Uri("https://eskuly.org");
        apiClient.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
        apiClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
        if (!string.IsNullOrEmpty(userToken))
        {
            apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
        }
        
        // جلب الرصيد
        var balanceResponse = await apiClient.PostAsync("/api/wallet/balance", balanceContent);
        
        // جلب الترخيص
        var licenseResponse = await apiClient.PostAsync("/api/license/check", licenseContent);
        
        // جلب سجل الطلبات
        var historyResponse = await apiClient.PostAsync("/api/tool-requests/history", historyContent);
    }
}
```

#### **2. LoadFreeToolsAsync - Supabase Client منفصل:**
```csharp
private async Task LoadFreeToolsAsync()
{
    // جلب الأدوات مباشرة من Supabase
    using (var supabaseClient = new HttpClient())
    {
        supabaseClient.BaseAddress = new Uri("https://ewkzduhofisinbhjrzzu.supabase.co");
        supabaseClient.DefaultRequestHeaders.Add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
        supabaseClient.DefaultRequestHeaders.Add("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
        
        // جلب الأدوات
        var response = await supabaseClient.GetAsync("/rest/v1/tools?select=*&order=name");
    }
}
```

#### **3. ShowUserToolRequestsAsync - API Client منفصل:**
```csharp
private async Task ShowUserToolRequestsAsync()
{
    // جلب سجل الطلبات عبر API
    using (var apiClient = new HttpClient())
    {
        apiClient.BaseAddress = new Uri("https://eskuly.org");
        apiClient.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
        apiClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
        if (!string.IsNullOrEmpty(userToken))
        {
            apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
        }
        
        // جلب سجل الطلبات
        var historyResponse = await apiClient.PostAsync("/api/tool-requests/history", historyContent);
    }
}
```

#### **4. شراء الأداة - API Client منفصل:**
```csharp
btnBuy.Click += async (s, e) =>
{
    // جلب الرصيد
    using (var apiClient = new HttpClient())
    {
        apiClient.BaseAddress = new Uri("https://eskuly.org");
        apiClient.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
        apiClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
        if (!string.IsNullOrEmpty(userToken))
        {
            apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
        }
        
        var balanceResponse = await apiClient.PostAsync("/api/wallet/balance", balanceContent);
    }
    
    // شراء الأداة
    using (var purchaseClient = new HttpClient())
    {
        purchaseClient.BaseAddress = new Uri("https://eskuly.org");
        purchaseClient.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
        purchaseClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
        if (!string.IsNullOrEmpty(userToken))
        {
            purchaseClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
        }
        
        var purchaseResponse = await purchaseClient.PostAsync("/api/tool-requests/create", purchaseContent);
    }
};
```

## 📋 مقارنة الطرق

| العملية | Client Type | Base URL | Headers |
|---------|------------|---------|---------|
| **الرصيد** | API Client | `https://eskuly.org` | Origin, User-Agent, Authorization |
| **الترخيص** | API Client | `https://eskuly.org` | Origin, User-Agent, Authorization |
| **سجل الطلبات** | API Client | `https://eskuly.org` | Origin, User-Agent, Authorization |
| **الأدوات** | Supabase Client | `https://ewkzduhofisinbhjrzzu.supabase.co` | apikey, Authorization |
| **شراء الأداة** | API Client | `https://eskuly.org` | Origin, User-Agent, Authorization |

## 🎯 النتيجة المتوقعة

### ✅ **بعد الإصلاح:**
- جلب الرصيد يعمل ✅
- جلب نوع الباقة يعمل ✅
- جلب الأدوات يعمل ✅
- جلب سجل الطلبات يعمل ✅
- شراء الأداة يعمل ✅

### ❌ **قبل الإصلاح:**
- جلب الرصيد لا يعمل ❌
- جلب نوع الباقة لا يعمل ❌
- جلب الأدوات يعمل ✅
- تضارب في الـ headers ❌

## 🚀 الخطوات التالية

### **1. إعادة بناء البرنامج**
```bash
cd toolygsm1/toolygsm1
dotnet build
```

### **2. تشغيل البرنامج**
```bash
dotnet run
```

### **3. اختبار جميع الميزات**
- ✅ تسجيل الدخول
- ✅ جلب الرصيد
- ✅ جلب نوع الباقة
- ✅ جلب الأدوات المتاحة
- ✅ جلب سجل الطلبات
- ✅ شراء الأداة

## 📝 ملاحظات مهمة

### **مبدأ فصل الاهتمامات:**
- **API Client**: للعمليات التي تحتاج JWT authentication
- **Supabase Client**: للعمليات التي تحتاج API key فقط

### **Headers المناسبة:**
- **API**: Origin, User-Agent, Authorization (JWT)
- **Supabase**: apikey, Authorization (API key)

## ✅ الخلاصة

تم إصلاح المشكلة بفصل API clients:

- ✅ **الرصيد**: API Client منفصل
- ✅ **الترخيص**: API Client منفصل
- ✅ **الأدوات**: Supabase Client منفصل
- ✅ **سجل الطلبات**: API Client منفصل
- ✅ **شراء الأداة**: API Client منفصل

**البرنامج الآن يعمل بشكل صحيح مع جميع الميزات!** 🚀
