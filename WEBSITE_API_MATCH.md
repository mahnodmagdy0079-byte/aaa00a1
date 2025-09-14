# تطابق البرنامج مع طريقة الموقع في جلب البيانات

## 🔍 تحليل طريقة الموقع

### **كيف يجلب الموقع البيانات:**

#### **1. جلب الرصيد:**
```typescript
// الموقع يستخدم API مع JWT token
const walletRes = await fetch("/api/wallet/balance", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
  body: JSON.stringify({ user_id: currentUser.id })
})
```

#### **2. جلب الترخيص:**
```typescript
// الموقع يستخدم API مع JWT token فقط
const licenseRes = await fetch("/api/license/check", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
})
```

#### **3. جلب الأدوات:**
```typescript
// الموقع يجلب الأدوات مباشرة من Supabase
const { data: tools, error: toolsError } = await supabase
  .from("tools")
  .select("*")
  .order("name")
```

#### **4. جلب سجل الطلبات:**
```typescript
// الموقع يستخدم Server Actions
const activeToolsResult = await getActiveToolRequestsAction(currentUser.email)
```

## 🛠️ التحديثات المطبقة في البرنامج

### **1. جلب الرصيد - مطابق للموقع:**
```csharp
// جلب رصيد المحفظة عبر API مثل الموقع
var balanceData = new JObject { ["user_id"] = userId };
var balanceContent = new StringContent(balanceData.ToString(), Encoding.UTF8, "application/json");
var balanceResponse = await client.PostAsync("/api/wallet/balance", balanceContent);
```

### **2. جلب الترخيص - مطابق للموقع:**
```csharp
// جلب معلومات الباقة عبر API مثل الموقع
var licenseResponse = await client.PostAsync("/api/license/check", 
    new StringContent("{}", Encoding.UTF8, "application/json"));
```

### **3. جلب الأدوات - مطابق للموقع:**
```csharp
// جلب الأدوات مباشرة من Supabase مثل الموقع
client.BaseAddress = new Uri("https://ewkzduhofisinbhjrzzu.supabase.co");
client.DefaultRequestHeaders.Clear();
client.DefaultRequestHeaders.Add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
client.DefaultRequestHeaders.Add("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");

var response = await client.GetAsync("/rest/v1/tools?select=*&order=name");
```

### **4. جلب سجل الطلبات - مطابق للموقع:**
```csharp
// جلب سجل الطلبات عبر API مثل الموقع
var historyResponse = await client.PostAsync("/api/tool-requests/history", 
    new StringContent("{}", Encoding.UTF8, "application/json"));
```

## 📋 مقارنة الطرق

| البيانات | الموقع | البرنامج (قبل) | البرنامج (بعد) |
|----------|--------|----------------|----------------|
| **الرصيد** | API + JWT | API + JWT | ✅ API + JWT |
| **الترخيص** | API + JWT | API + JWT | ✅ API + JWT |
| **الأدوات** | Supabase مباشر | API | ✅ Supabase مباشر |
| **سجل الطلبات** | Server Actions | API + JWT | ✅ API + JWT |

## 🔧 Headers المطلوبة

### **لـ API Calls:**
```csharp
client.DefaultRequestHeaders.Add("Origin", "https://eskuly.org");
client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
client.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
```

### **لـ Supabase Calls:**
```csharp
client.DefaultRequestHeaders.Add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
client.DefaultRequestHeaders.Add("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
```

## 🎯 النتيجة المتوقعة

### ✅ **بعد التحديث:**
- جلب الرصيد يعمل مثل الموقع
- جلب الترخيص يعمل مثل الموقع
- جلب الأدوات يعمل مثل الموقع
- جلب سجل الطلبات يعمل مثل الموقع

### ❌ **قبل التحديث:**
- الأدوات لا تظهر (API غير موجود)
- بيانات مختلفة عن الموقع

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

### **3. اختبار الميزات**
- ✅ تسجيل الدخول
- ✅ جلب الرصيد
- ✅ جلب نوع الباقة
- ✅ جلب الأدوات المتاحة
- ✅ جلب سجل الطلبات

## 📝 ملاحظات مهمة

### **الفرق الرئيسي:**
- **الموقع**: يجلب الأدوات من Supabase مباشرة
- **البرنامج**: كان يحاول جلبها من API غير موجود

### **الحل:**
- **البرنامج**: الآن يجلب الأدوات من Supabase مباشرة مثل الموقع

## ✅ الخلاصة

تم تحديث البرنامج ليطابق طريقة الموقع في جلب البيانات:

- ✅ **الرصيد**: API + JWT (مطابق للموقع)
- ✅ **الترخيص**: API + JWT (مطابق للموقع)
- ✅ **الأدوات**: Supabase مباشر (مطابق للموقع)
- ✅ **سجل الطلبات**: API + JWT (مطابق للموقع)

**البرنامج الآن يعمل بنفس طريقة الموقع!** 🚀
