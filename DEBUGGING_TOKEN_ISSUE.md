# إضافة Debugging للتوكن - TOOLY GSM Desktop

## 🚨 المشكلة

**البرنامج يعمل تسجيل الدخول بنجاح (200) لكن الـ Authorization header لا يصل للـ API endpoints الأخرى**

**الأخطاء في Vercel:**
```
POST 401 eskuly.org /api/wallet/balance [API] Wallet balance - Auth header: Missing
POST 400 eskuly.org /api/license/check
POST 400 eskuly.org /api/tool-requests/history
```

## 🔍 تحليل المشكلة

### **المشكلة المحتملة:**
1. **التوكن فارغ أو null**
2. **التوكن لا يتم تمريره بشكل صحيح**
3. **التوكن لا يتم إرساله في الـ headers**

## 🛠️ الحل المطبق

### **إضافة Debugging شامل:**

#### **1. في LoginForm.cs:**
```csharp
// Debug: طباعة التوكن للتأكد
System.Diagnostics.Debug.WriteLine($"Login Result: {loginResult}");
System.Diagnostics.Debug.WriteLine($"Token from login: {token}");
System.Diagnostics.Debug.WriteLine($"Token Length: {token?.Length ?? 0}");

// عرض التوكن في MessageBox للتأكد
MessageBox.Show($"Token: {token?.Substring(0, Math.Min(50, token?.Length ?? 0))}...\nLength: {token?.Length ?? 0}", "Debug Token", MessageBoxButtons.OK, MessageBoxIcon.Information);
```

#### **2. في Form1.cs:**
```csharp
// Debug: طباعة التوكن للتأكد
System.Diagnostics.Debug.WriteLine($"Token: {userToken}");
System.Diagnostics.Debug.WriteLine($"Token Length: {userToken?.Length ?? 0}");

// عرض التوكن في MessageBox للتأكد
MessageBox.Show($"Form1 Token: {userToken?.Substring(0, Math.Min(50, userToken?.Length ?? 0))}...\nLength: {userToken?.Length ?? 0}", "Debug Form1 Token", MessageBoxButtons.OK, MessageBoxIcon.Information);
```

#### **3. Debugging استجابات API:**
```csharp
// Debug: طباعة استجابة الرصيد
System.Diagnostics.Debug.WriteLine($"Balance Response Status: {balanceResponse.StatusCode}");
var balanceResponseContent = await balanceResponse.Content.ReadAsStringAsync();
System.Diagnostics.Debug.WriteLine($"Balance Response Content: {balanceResponseContent}");

// Debug: طباعة استجابة الترخيص
System.Diagnostics.Debug.WriteLine($"License Response Status: {licenseResponse.StatusCode}");
var licenseResponseContent = await licenseResponse.Content.ReadAsStringAsync();
System.Diagnostics.Debug.WriteLine($"License Response Content: {licenseResponseContent}");
```

#### **4. Debugging Authorization Header:**
```csharp
if (!string.IsNullOrEmpty(userToken))
{
    apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
    System.Diagnostics.Debug.WriteLine($"Authorization header added: Bearer {userToken.Substring(0, Math.Min(20, userToken.Length))}...");
}
else
{
    System.Diagnostics.Debug.WriteLine("Token is empty or null!");
}
```

## 📋 خطوات الاختبار

### **1. إعادة بناء البرنامج:**
```bash
cd toolygsm1/toolygsm1
dotnet build
```

### **2. تشغيل البرنامج:**
```bash
dotnet run
```

### **3. مراقبة MessageBoxes:**
- **MessageBox 1**: عرض التوكن من LoginForm
- **MessageBox 2**: عرض التوكن في Form1
- **Debug Output**: في Visual Studio Output window

### **4. مراقبة Vercel Logs:**
- تحقق من وصول Authorization header
- تحقق من استجابات API

## 🎯 النتائج المتوقعة

### **إذا كان التوكن صحيح:**
- MessageBox 1: عرض التوكن (50 حرف أول)
- MessageBox 2: عرض نفس التوكن
- Vercel Logs: `Authorization: Bearer eyJ...`
- API Responses: 200 OK

### **إذا كان التوكن فارغ:**
- MessageBox 1: `Token: ...\nLength: 0`
- MessageBox 2: `Token: ...\nLength: 0`
- Vercel Logs: `[API] Wallet balance - Auth header: Missing`
- API Responses: 401 Unauthorized

## 🔧 الإصلاحات المحتملة

### **إذا كان التوكن فارغ:**
1. **فحص API Response Structure**
2. **تغيير `access_token` إلى `token`**
3. **فحص JSON Parsing**

### **إذا كان التوكن موجود لكن لا يعمل:**
1. **فحص Token Format**
2. **فحص Token Expiration**
3. **فحص API Endpoint Requirements**

## 📝 ملاحظات مهمة

### **Debugging Strategy:**
- **MessageBox**: للتحقق السريع
- **Debug.WriteLine**: للتحقق التفصيلي
- **Vercel Logs**: للتحقق من Server-side

### **Token Flow:**
1. **LoginForm**: يحصل على التوكن من API
2. **Program.cs**: يمرر التوكن لـ Form1
3. **Form1**: يستخدم التوكن في API calls

## ✅ الخلاصة

تم إضافة debugging شامل لتتبع:

- ✅ **Token في LoginForm**
- ✅ **Token في Form1**
- ✅ **Authorization Header**
- ✅ **API Responses**
- ✅ **Error Messages**

**الآن يمكن تحديد المشكلة بدقة!** 🔍
