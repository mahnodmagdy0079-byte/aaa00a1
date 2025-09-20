# تحليل برنامج Desktop - TOOLY GSM

## 🔍 تحليل طريقة الاتصال بقاعدة البيانات

### البرنامج يستخدم **اتصال مباشر** بقاعدة البيانات Supabase

## 📊 تدفق البيانات في البرنامج

### 1. تسجيل الدخول (LoginForm.cs)

```
المستخدم → LoginForm → API Website → Supabase Auth → JWT Token → Form1
```

**التفاصيل:**
- **البرنامج يتصل بـ API الموقع** وليس مباشرة بـ Supabase
- **URL**: `https://eskuly.org/api/auth/signin`
- **الطريقة**: POST request مع email و password
- **النتيجة**: JWT token وبيانات المستخدم

```csharp
// LoginForm.cs - السطر 94-109
client.BaseAddress = new Uri("https://eskuly.org");
var response = await client.PostAsync("/api/auth/signin", content);
```

### 2. جلب بيانات المستخدم (Form1.cs)

#### أ) رصيد المحفظة
```
Form1 → Supabase REST API → user_wallets table
```

**التفاصيل:**
- **اتصال مباشر** بـ Supabase REST API
- **URL**: `https://ewkzduhofisinbhjrzzu.supabase.co/rest/v1/user_wallets`
- **الطريقة**: GET request مع user_id

```csharp
// Form1.cs - السطر 195
var response = await client.GetAsync($"/rest/v1/{TableNames.UserWallets}?select=balance&user_id=eq.{userId}");
```

#### ب) بيانات الترخيص
```
Form1 → Supabase REST API → licenses table
```

**التفاصيل:**
- **اتصال مباشر** بـ Supabase REST API
- **URL**: `https://ewkzduhofisinbhjrzzu.supabase.co/rest/v1/licenses`
- **الطريقة**: GET request مع user_name

```csharp
// Form1.cs - السطر 216
response = await client.GetAsync($"/rest/v1/{TableNames.Licenses}?select=package_name,end_date,user_id,user_email,user_name&user_name=eq.{userName}");
```

#### ج) الأدوات المتاحة
```
Form1 → Supabase REST API → tools table
```

**التفاصيل:**
- **اتصال مباشر** بـ Supabase REST API
- **URL**: `https://ewkzduhofisinbhjrzzu.supabase.co/rest/v1/tools`

```csharp
// Form1.cs - السطر 613
var response = await client.GetAsync($"/rest/v1/{TableNames.Tools}?select=id,name,price,duration_hours,image_url");
```

#### د) طلبات الأدوات
```
Form1 → Supabase REST API → tool_requests table
```

**التفاصيل:**
- **اتصال مباشر** بـ Supabase REST API
- **URL**: `https://ewkzduhofisinbhjrzzu.supabase.co/rest/v1/tool_requests`

```csharp
// Form1.cs - السطر 491
var response = await client.GetAsync($"/rest/v1/{TableNames.ToolRequests}?select=user_name,tool_name,created_at,status_ar,price&user_name=eq.{userName}&order=created_at.desc&limit={requestsPageSize}&offset={offset}");
```

## 🔧 إعدادات الاتصال

### Supabase Configuration (models.cs)
```csharp
public static class SupabaseConfig
{
    public const string BaseUrl = "https://ewkzduhofisinbhjrzzu.supabase.co";
    public const string ApiKey = "YOUR_SUPABASE_API_KEY_HERE"; // يجب استخدام Environment Variables
}
```

### Headers المستخدمة
```csharp
client.DefaultRequestHeaders.Add("apikey", SupabaseConfig.ApiKey);
client.DefaultRequestHeaders.Add("Authorization", SupabaseConfig.ApiKey);
```

## 📋 مقارنة بين الموقع والبرنامج

| الميزة | الموقع (Web) | البرنامج (Desktop) |
|--------|-------------|-------------------|
| **تسجيل الدخول** | API Website | API Website |
| **جلب الرصيد** | API Website | Supabase مباشر |
| **جلب الترخيص** | API Website | Supabase مباشر |
| **جلب الأدوات** | Supabase مباشر | Supabase مباشر |
| **طلبات الأدوات** | API Website | Supabase مباشر |
| **الأمان** | JWT + API | API Key مباشر |

## 🔐 الأمان

### الموقع (Web):
- ✅ **JWT Authentication** - محمي
- ✅ **API Routes** - محمي
- ✅ **Rate Limiting** - محمي
- ✅ **CORS Protection** - محمي

### البرنامج (Desktop):
- ⚠️ **API Key مباشر** - أقل أماناً
- ⚠️ **اتصال مباشر** بـ Supabase
- ⚠️ **لا يوجد Rate Limiting**
- ⚠️ **لا يوجد CORS** (لأنه desktop)

## 🚨 المشاكل المحتملة

### 1. أمان API Key
- **المشكلة**: API Key مكشوف في الكود
- **الحل**: استخدام Environment Variables

### 2. عدم وجود Rate Limiting
- **المشكلة**: يمكن للبرنامج إرسال طلبات كثيرة
- **الحل**: إضافة Rate Limiting في البرنامج

### 3. عدم وجود JWT Authentication
- **المشكلة**: البرنامج لا يستخدم JWT للطلبات
- **الحل**: استخدام JWT من تسجيل الدخول

## 💡 التوصيات

### 1. تحسين الأمان
```csharp
// بدلاً من API Key مباشر
public static class SupabaseConfig
{
    public static string BaseUrl => Environment.GetEnvironmentVariable("SUPABASE_URL") ?? "https://ewkzduhofisinbhjrzzu.supabase.co";
    public static string ApiKey => Environment.GetEnvironmentVariable("SUPABASE_API_KEY") ?? "default_key";
}
```

### 2. استخدام JWT Authentication
```csharp
// إضافة JWT للطلبات
client.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
```

### 3. إضافة Rate Limiting
```csharp
// إضافة تأخير بين الطلبات
await Task.Delay(1000); // 1 ثانية بين الطلبات
```

## 📊 الخلاصة

### البرنامج يستخدم:
- ✅ **API الموقع** لتسجيل الدخول
- ⚠️ **اتصال مباشر** بـ Supabase لبقية البيانات
- ⚠️ **API Key مكشوف** في الكود
- ⚠️ **لا يوجد JWT Authentication** للطلبات

### الموقع يستخدم:
- ✅ **API محمي** لجميع العمليات
- ✅ **JWT Authentication** محمي
- ✅ **Rate Limiting** محمي
- ✅ **CORS Protection** محمي

**النتيجة**: الموقع أكثر أماناً من البرنامج، والبرنامج يحتاج تحسينات أمنية.
