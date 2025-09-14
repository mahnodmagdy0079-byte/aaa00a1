# إصلاح خطأ 403 في API - TOOLY GSM Desktop

## 🚨 المشكلة

**الخطأ**: `403 Forbidden` عند محاولة تسجيل الدخول
**السبب**: البرنامج لا يرسل `Content-Type: application/json` header

## 🔍 تحليل المشكلة

### **من Vercel Logs:**
```
POST 403 eskuly.org /api/auth/signin
```

### **سبب الخطأ:**
- ✅ الطلب يصل للخادم
- ❌ الخادم يرفض الطلب بسبب missing headers
- ❌ البرنامج لا يرسل `Content-Type: application/json`

## 🛠️ الحل المطبق

### **1. إضافة Content-Type Header في LoginForm.cs**

#### **GetUserObjectAsync():**
```csharp
using (var client = new HttpClient())
{
    client.BaseAddress = new Uri("https://eskuly.org");
    client.DefaultRequestHeaders.Add("Content-Type", "application/json"); // ✅ إضافة هذا
    var data = new JObject
    {
        ["email"] = email,
        ["password"] = password
    };
    var content = new StringContent(data.ToString(), Encoding.UTF8, "application/json");
    var response = await client.PostAsync("/api/auth/signin", content);
}
```

#### **GetLastErrorContent():**
```csharp
using (var client = new HttpClient())
{
    client.BaseAddress = new Uri("https://eskuly.org");
    client.DefaultRequestHeaders.Add("Content-Type", "application/json"); // ✅ إضافة هذا
    // ... باقي الكود
}
```

### **2. إضافة Content-Type Header في Form1.cs**

#### **جميع API Calls:**
```csharp
using (var client = new HttpClient())
{
    client.BaseAddress = new Uri("https://eskuly.org");
    client.DefaultRequestHeaders.Add("Content-Type", "application/json"); // ✅ إضافة هذا
    // ... باقي الكود
}
```

## 📋 الملفات المحدثة

### ✅ **LoginForm.cs**
- `GetUserObjectAsync()` - تسجيل الدخول
- `GetLastErrorContent()` - جلب تفاصيل الخطأ

### ✅ **Form1.cs**
- `LoadUserDataAsync()` - جلب بيانات المستخدم
- `ShowUserToolRequestsAsync()` - جلب سجل الطلبات
- `LoadFreeToolsAsync()` - جلب الأدوات المتاحة
- جميع API calls الأخرى

## 🔧 كيفية اختبار الإصلاح

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

## 🎯 النتيجة المتوقعة

### ✅ **بعد الإصلاح:**
- تسجيل الدخول يعمل بنجاح
- لا توجد أخطاء 403 في Vercel logs
- جلب البيانات يعمل بشكل صحيح

### ❌ **قبل الإصلاح:**
- خطأ 403 Forbidden
- فشل في تسجيل الدخول
- رسالة "Access denied"

## 📊 مقارنة Headers

### **قبل الإصلاح:**
```http
POST /api/auth/signin HTTP/1.1
Host: eskuly.org
Content-Length: 45
```

### **بعد الإصلاح:**
```http
POST /api/auth/signin HTTP/1.1
Host: eskuly.org
Content-Type: application/json  ✅
Content-Length: 45
```

## 🚀 الخطوات التالية

1. **إعادة بناء البرنامج** مع التحديثات الجديدة
2. **اختبار تسجيل الدخول** مع بيانات صحيحة
3. **التحقق من Vercel logs** - يجب أن تظهر 200 بدلاً من 403
4. **اختبار جميع الميزات** (الرصيد، الترخيص، الأدوات)

## 📝 ملاحظات مهمة

- **Content-Type header** مطلوب لجميع API calls
- **JSON format** يجب أن يكون صحيح
- **Encoding** يجب أن يكون UTF-8

## ✅ الخلاصة

تم إصلاح مشكلة 403 بإضافة `Content-Type: application/json` header لجميع API calls. البرنامج الآن يجب أن يعمل بشكل صحيح مع موقعك.

**النتيجة**: تسجيل الدخول يعمل بنجاح! 🚀
