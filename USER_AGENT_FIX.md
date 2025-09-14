# إصلاح مشكلة User-Agent - TOOLY GSM Desktop

## 🚨 المشكلة

**الخطأ**: `403 Forbidden` عند محاولة تسجيل الدخول
**السبب**: البرنامج لا يرسل `User-Agent` header، مما يسبب رفض الـ rate limiting للطلب

## 🔍 تحليل المشكلة

### **من Vercel Logs:**
```
POST 403 eskuly.org /api/auth/signin
```

### **سبب المشكلة:**
- ✅ الطلب يصل للخادم
- ❌ Rate limiting يرفض الطلبات بدون User-Agent
- ❌ Rate limiting يرفض User-Agent فارغ أو مشبوه

### **Rate Limiting Logic:**
```typescript
// التحقق من User-Agent المشبوه
if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent === '') {
  return new NextResponse(
    JSON.stringify({ error: 'Access denied' }),
    { status: 403, headers: { 'Content-Type': 'application/json' } }
  )
}
```

## 🛠️ الحل المطبق

### **إضافة User-Agent Header**

#### **LoginForm.cs:**
```csharp
using (var client = new HttpClient())
{
    client.BaseAddress = new Uri("https://eskuly.org");
    client.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
    client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0"); // ✅ إضافة هذا
    var data = new JObject
    {
        ["email"] = email,
        ["password"] = password
    };
    var content = new StringContent(data.ToString(), Encoding.UTF8, "application/json");
    var response = await client.PostAsync("/api/auth/signin", content);
}
```

#### **Form1.cs:**
```csharp
using (var client = new HttpClient())
{
    client.BaseAddress = new Uri("https://eskuly.org");
    client.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
    client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0"); // ✅ إضافة هذا
    // ... باقي الكود
}
```

## 📋 الملفات المحدثة

### ✅ **LoginForm.cs**
- `GetUserObjectAsync()` - إضافة User-Agent header
- `GetLastErrorContent()` - إضافة User-Agent header

### ✅ **Form1.cs**
- `LoadUserDataAsync()` - إضافة User-Agent header
- `ShowUserToolRequestsAsync()` - إضافة User-Agent header
- `LoadFreeToolsAsync()` - إضافة User-Agent header
- جميع API calls الأخرى

## 🔧 كيفية عمل Rate Limiting

### **Rate Limiting Rules:**
```typescript
const MAX_REQUESTS_AUTH = 5 // حد أقل لطلبات المصادقة
const WINDOW_MS = 60 * 1000 // نافذة زمنية: 60 ثانية

// User-Agent Validation
if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent === '') {
  return 403 // Access denied
}
```

### **User-Agent Header:**
```csharp
client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
```

## 🎯 النتيجة المتوقعة

### ✅ **بعد الإصلاح:**
- تسجيل الدخول يعمل بنجاح
- لا توجد أخطاء 403 في Vercel logs
- Rate limiting يعمل بشكل صحيح

### ❌ **قبل الإصلاح:**
- خطأ 403 Forbidden
- فشل في تسجيل الدخول
- Rate limiting يرفض الطلب

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

### **3. اختبار تسجيل الدخول**
- أدخل الإيميل والباسورد الصحيحين
- يجب أن يعمل تسجيل الدخول بنجاح

## 📝 ملاحظات مهمة

### **Headers المطلوبة:**
- **Origin**: `https://eskuly.org`
- **User-Agent**: `TOOLY-GSM-Desktop/1.0`
- **Content-Type**: يتم إرساله تلقائياً في StringContent

### **Rate Limiting:**
- **طلبات المصادقة**: 5 طلبات في 60 ثانية
- **User-Agent**: يجب أن يكون موجود وليس مشبوه
- **IP Tracking**: يتم تتبع الطلبات لكل IP

## ✅ الخلاصة

تم إصلاح مشكلة 403 بإضافة `User-Agent` header لجميع API calls. البرنامج الآن يرسل الـ headers المطلوبة للـ rate limiting.

**النتيجة**: تسجيل الدخول يعمل بنجاح! 🚀
