# دليل النشر - TOOLY GSM Platform

## ✅ جاهزية المشروع

المشروع جاهز تماماً للنشر على Vercel أو Netlify. تم إصلاح جميع الأخطاء وإضافة الملفات المطلوبة.

## 📋 متطلبات النشر

### 1. قاعدة البيانات (Supabase)
- يجب إنشاء مشروع Supabase جديد
- تشغيل ملفات SQL الموجودة في مجلد `scripts/` بالترتيب
- الحصول على URL و API Keys

### 2. متغيرات البيئة المطلوبة
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## 🚀 النشر على Vercel

### الطريقة الأولى: من GitHub
1. ارفع المشروع إلى GitHub
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. اضغط "New Project"
4. اختر المشروع من GitHub
5. أضف متغيرات البيئة في إعدادات المشروع
6. اضغط "Deploy"

### الطريقة الثانية: من Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel

# إضافة متغيرات البيئة
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## 🌐 النشر على Netlify

### الطريقة الأولى: من GitHub
1. ارفع المشروع إلى GitHub
2. اذهب إلى [Netlify Dashboard](https://app.netlify.com/)
3. اضغط "New site from Git"
4. اختر GitHub واختر المشروع
5. أضف متغيرات البيئة في Site settings > Environment variables
6. اضغط "Deploy site"

### الطريقة الثانية: من Netlify CLI
```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# تسجيل الدخول
netlify login

# النشر
netlify deploy --prod

# إضافة متغيرات البيئة
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your_key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_service_key"
```

## 🔧 إعداد قاعدة البيانات

### 1. إنشاء مشروع Supabase
- اذهب إلى [Supabase](https://supabase.com)
- أنشئ مشروع جديد
- احصل على URL و API Keys

### 2. تشغيل ملفات SQL
قم بتشغيل الملفات التالية بالترتيب في SQL Editor:

```sql
-- 1. إنشاء جدول التراخيص
-- تشغيل: 001_create_licenses_table.sql

-- 2. إدراج تراخيص تجريبية
-- تشغيل: 002_insert_test_licenses.sql

-- 3. إضافة معلومات المستخدم
-- تشغيل: 003_add_user_info_to_licenses.sql

-- 4. إنشاء جدول طلبات الأدوات
-- تشغيل: 004_create_tool_requests_table.sql

-- 5. إضافة ملاحظات لطلبات الأدوات
-- تشغيل: 005_add_notes_to_tool_requests.sql

-- 6. إضافة حالة لطلبات الأدوات
-- تشغيل: 006_add_status_to_tool_requests.sql

-- 7. إنشاء طلبات تغيير كلمة المرور
-- تشغيل: 007_create_password_change_requests.sql

-- 8. إنشاء جدول المستخدمين
-- تشغيل: 008_create_users_table.sql

-- 9. إصلاح trigger المستخدمين
-- تشغيل: 009_fix_users_trigger.sql

-- 10. إصلاح وصول الإدارة للمستخدمين
-- تشغيل: 010_fix_admin_access_to_users.sql

-- 11. إصلاح RLS لجدول المستخدمين
-- تشغيل: 011_fix_users_table_rls.sql

-- 12. تعطيل RLS لجدول المستخدمين
-- تشغيل: 012_disable_users_table_rls.sql

-- 13. إنشاء قوائم الهواتف
-- تشغيل: 013_create_phone_listings.sql

-- 14. إنشاء طلبات الشراء
-- تشغيل: 014_create_purchase_requests.sql

-- 15. تفعيل Row Level Security
-- تشغيل: 015_enable_row_level_security.sql

-- 16. إصلاح سياسات طلبات الشراء
-- تشغيل: 015_fix_purchase_requests_policies.sql

-- 17. إنشاء الدوال الآمنة
-- تشغيل: 016_create_secure_functions.sql

-- 18. إنشاء محافظ المستخدمين
-- تشغيل: 016_create_user_wallets.sql

-- 19. إنشاء جدول حسابات فتح الحسابات
-- تشغيل: 017_create_unlock_accounts_table.sql

-- 20. إنشاء دوال المحافظ
-- تشغيل: 017_create_wallet_functions.sql

-- 21. إصلاح سياسات RLS للمستخدمين
-- تشغيل: 018_fix_users_table_rls_policies.sql

-- 22. إنشاء نظام طلبات الأدوات
-- تشغيل: 019_create_tool_requests_system.sql

-- 23. إنشاء trigger تسجيل المستخدمين
-- تشغيل: 020_create_user_signup_trigger.sql

-- 24. إنشاء schema الأدوات والطلبات
-- تشغيل: 021_create_tools_and_requests_schema.sql

-- 25. إصلاح schema الأدوات والطلبات
-- تشغيل: 022_fix_tools_and_requests_schema.sql

-- 26. إصلاح schema الأدوات والقيود
-- تشغيل: 023_fix_tools_schema_and_constraints.sql

-- 27. إعادة هيكلة نظام طلبات الأدوات
-- تشغيل: 024_restructure_tool_request_system.sql

-- 28. إصلاح السياسات الأمنية
-- تشغيل: 025_fix_security_policies.sql

-- 29. السياسات الأمنية الآمنة
-- تشغيل: 026_safe_security_policies.sql
```

## 🔒 الأمان

### متغيرات البيئة الحساسة
- `SUPABASE_SERVICE_ROLE_KEY`: مفتاح حساس، لا تشاركه أبداً
- `NEXT_PUBLIC_SUPABASE_URL`: يمكن مشاركته
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: يمكن مشاركته

### رؤوس الأمان
تم إضافة رؤوس أمان متقدمة في:
- `middleware.ts`
- `next.config.mjs`
- `vercel.json`
- `netlify.toml`

## 📊 مراقبة الأداء

### Vercel Analytics
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Netlify Analytics
- تفعيل Analytics من لوحة التحكم

## 🐛 استكشاف الأخطاء

### مشاكل شائعة
1. **خطأ في قاعدة البيانات**: تأكد من تشغيل جميع ملفات SQL
2. **خطأ في المتغيرات**: تأكد من إضافة جميع متغيرات البيئة
3. **خطأ في البناء**: تأكد من أن `npm run build` يعمل محلياً

### سجلات الأخطاء
- Vercel: Functions > View Function Logs
- Netlify: Functions > View Function Logs

## 📞 الدعم

للدعم التقني:
- تحقق من سجلات الأخطاء
- تأكد من إعداد قاعدة البيانات
- تحقق من متغيرات البيئة

## ✅ قائمة التحقق النهائية

- [ ] تم رفع المشروع إلى GitHub
- [ ] تم إنشاء مشروع Supabase
- [ ] تم تشغيل جميع ملفات SQL
- [ ] تم إضافة متغيرات البيئة
- [ ] تم النشر على Vercel/Netlify
- [ ] تم اختبار الموقع بعد النشر
- [ ] تم إعداد Analytics (اختياري)

---

**ملاحظة**: المشروع جاهز تماماً للنشر ولا يحتاج أي تعديلات إضافية.
