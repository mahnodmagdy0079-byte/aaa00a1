# تحديثات البرنامج للعمل مع RLS

## المشكلة
بعد إضافة Row Level Security (RLS) في قاعدة البيانات، البرنامج لم يعد يستطيع الوصول للبيانات مباشرة عبر Supabase API.

## الحل
تم تعديل البرنامج لاستخدام API endpoints الجديدة بدلاً من الوصول المباشر لقاعدة البيانات.

## التغييرات المطلوبة

### 1. استبدال Form1.cs
- استبدل الملف الحالي `Form1.cs` بالملف الجديد `Form1_Updated.cs`
- أو انسخ المحتوى من `Form1_Updated.cs` إلى `Form1.cs`

### 2. التحديثات المطبقة

#### أ. تسجيل الدخول
- تم تغيير endpoint من `/auth/v1/token` إلى `/api/auth/signin`
- تم إضافة دعم لحفظ التوكن (JWT Token) للمصادقة

#### ب. جلب بيانات المستخدم
- **الرصيد**: استخدام `/api/wallet/balance` بدلاً من الوصول المباشر لجدول `user_wallets`
- **الباقة**: استخدام `/api/license/check` بدلاً من الوصول المباشر لجدول `licenses`
- **السجل**: استخدام `/api/tool-requests/history` بدلاً من الوصول المباشر لجدول `tool_requests`

#### ج. شراء الأدوات
- استخدام `/api/tool-requests/purchase` لإنشاء طلبات جديدة
- إضافة Authorization header مع التوكن

### 3. API Endpoints المستخدمة

```
POST /api/auth/signin
- Body: { "email": "user@example.com", "password": "password" }
- Response: { "user": {...}, "access_token": "jwt_token" }

POST /api/wallet/balance
- Body: { "user_id": "user_id" }
- Headers: Authorization: Bearer jwt_token
- Response: { "success": true, "balance": 100.50 }

POST /api/license/check
- Body: { "user_email": "user@example.com" }
- Response: { "valid": true, "license": {...} }

POST /api/tool-requests/history
- Body: { "user_email": "user@example.com" }
- Headers: Authorization: Bearer jwt_token
- Response: { "success": true, "requests": [...] }

POST /api/tool-requests/purchase
- Body: { "user_id": "id", "user_name": "name", "tool_name": "tool", "tool_price": 10, "duration_hours": 24 }
- Headers: Authorization: Bearer jwt_token
- Response: { "success": true, "message": "تم الشراء بنجاح" }

GET /api/tools
- Response: [{ "id": 1, "name": "tool", "price": 10, "duration_hours": 24, "image_url": "..." }]
```

### 4. الملفات المحدثة

1. **LoginForm.cs** - تحديث تسجيل الدخول
2. **Program.cs** - تمرير التوكن
3. **Form1_Updated.cs** - النسخة المحدثة من Form1.cs

### 5. خطوات التطبيق

1. انسخ محتوى `Form1_Updated.cs` إلى `Form1.cs`
2. احذف `Form1_Updated.cs`
3. قم ببناء المشروع
4. اختبر البرنامج

### 6. ملاحظات مهمة

- تأكد من أن API endpoints تعمل بشكل صحيح
- تأكد من أن التوكن يتم تمريره بشكل صحيح
- في حالة وجود أخطاء، تحقق من استجابة API endpoints
- البرنامج الآن يعمل مع النظام الآمن الجديد

### 7. استكشاف الأخطاء

إذا واجهت مشاكل:
1. تحقق من اتصال الإنترنت
2. تأكد من صحة API endpoints
3. تحقق من صحة التوكن
4. راجع رسائل الخطأ في Console

## النتيجة
البرنامج الآن يعمل بشكل آمن مع RLS ولا يحتاج للوصول المباشر لقاعدة البيانات.




