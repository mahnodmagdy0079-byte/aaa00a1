# سجل التغييرات - تحديث البرنامج للعمل مع RLS

## الإصدار 2.0 - تحديث الأمان
**التاريخ**: اليوم  
**السبب**: إضافة Row Level Security (RLS) في قاعدة البيانات

---

## التغييرات الرئيسية

### 🔐 الأمان
- **قبل**: الوصول المباشر لقاعدة البيانات عبر Supabase API Key
- **بعد**: استخدام API endpoints آمنة مع JWT Token

### 🔄 تسجيل الدخول
- **قبل**: `/auth/v1/token?grant_type=password`
- **بعد**: `/api/auth/signin`
- **جديد**: حفظ JWT Token للمصادقة

### 💰 جلب الرصيد
- **قبل**: `GET /rest/v1/user_wallets?select=balance&user_id=eq.{userId}`
- **بعد**: `POST /api/wallet/balance` مع Authorization header

### 📦 جلب معلومات الباقة
- **قبل**: `GET /rest/v1/licenses?select=package_name,end_date&user_name=eq.{userName}`
- **بعد**: `POST /api/license/check` مع user_email

### 📋 جلب سجل الطلبات
- **قبل**: `GET /rest/v1/tool_requests?select=...&user_name=eq.{userName}`
- **بعد**: `POST /api/tool-requests/history` مع Authorization header

### 🛒 شراء الأدوات
- **قبل**: لم يكن موجوداً
- **بعد**: `POST /api/tool-requests/purchase` مع Authorization header

---

## الملفات المحدثة

| الملف | التغيير | الوصف |
|-------|---------|--------|
| `LoginForm.cs` | تحديث | استخدام API endpoint جديد وحفظ التوكن |
| `Program.cs` | تحديث | تمرير التوكن للـ Form1 |
| `Form1.cs` | استبدال كامل | استخدام API endpoints بدلاً من Supabase مباشرة |

---

## API Endpoints الجديدة

### المصادقة
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### الرصيد
```http
POST /api/wallet/balance
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "user_id": "user_id"
}
```

### الباقة
```http
POST /api/license/check
Content-Type: application/json

{
  "user_email": "user@example.com"
}
```

### سجل الطلبات
```http
POST /api/tool-requests/history
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "user_email": "user@example.com"
}
```

### شراء أداة
```http
POST /api/tool-requests/purchase
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "user_id": "user_id",
  "user_name": "user_name",
  "tool_name": "tool_name",
  "tool_price": 10.0,
  "duration_hours": 24
}
```

### قائمة الأدوات
```http
GET /api/tools
```

---

## المزايا الجديدة

### ✅ الأمان
- حماية البيانات عبر RLS
- مصادقة آمنة بـ JWT Token
- عدم الوصول المباشر لقاعدة البيانات

### ✅ الاستقرار
- API endpoints مستقرة
- معالجة أفضل للأخطاء
- استجابة موحدة

### ✅ المرونة
- سهولة إضافة ميزات جديدة
- إمكانية التحكم في الوصول
- تسجيل أفضل للعمليات

---

## خطوات التطبيق

1. **نسخ الملفات**:
   ```bash
   copy Form1_Updated.cs Form1.cs /Y
   ```

2. **حذف الملفات المؤقتة**:
   ```bash
   del Form1_Updated.cs
   ```

3. **بناء المشروع**:
   - فتح Visual Studio
   - Build → Rebuild Solution

4. **اختبار البرنامج**:
   - تشغيل البرنامج
   - تسجيل الدخول
   - التحقق من جلب البيانات

---

## استكشاف الأخطاء

### مشكلة: "حدث خطأ أثناء جلب البيانات"
**الحل**: تحقق من:
- اتصال الإنترنت
- صحة API endpoints
- صحة التوكن

### مشكلة: "اسم المستخدم أو كلمة المرور غير صحيحة"
**الحل**: تحقق من:
- صحة بيانات تسجيل الدخول
- عمل API endpoint `/api/auth/signin`

### مشكلة: "الرصيد غير كاف"
**الحل**: تحقق من:
- جلب الرصيد عبر `/api/wallet/balance`
- صحة التوكن في Authorization header

---

## ملاحظات مهمة

- ⚠️ **مهم**: تأكد من عمل جميع API endpoints قبل تشغيل البرنامج
- 🔒 **أمان**: التوكن له مدة صلاحية محددة
- 📱 **اختبار**: اختبر جميع الوظائف بعد التحديث
- 🔄 **نسخ احتياطي**: احتفظ بنسخة من الملفات القديمة

---

## الدعم

في حالة وجود مشاكل:
1. راجع ملف `README_Updates.md`
2. تحقق من استجابة API endpoints
3. راجع رسائل الخطأ في Console
4. تواصل مع فريق التطوير

---

**تم التحديث بنجاح! 🎉**

