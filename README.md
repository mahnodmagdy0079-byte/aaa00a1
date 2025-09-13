# TOOLY GSM - Subscription Plans Platform

منصة باقات الاشتراك لإصلاح الهواتف المحمولة

## الميزات

- نظام إدارة المستخدمين والتراخيص
- لوحة تحكم إدارية شاملة
- نظام محفظة رقمية
- طلبات الأدوات والخدمات
- دعم اللغة العربية والإنجليزية
- تصميم متجاوب وحديث

## التقنيات المستخدمة

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel/Netlify Ready

## متطلبات النشر

### متغيرات البيئة المطلوبة

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### قاعدة البيانات

يجب تشغيل ملفات SQL الموجودة في مجلد `scripts/` على قاعدة بيانات Supabase:

1. `001_create_licenses_table.sql`
2. `002_insert_test_licenses.sql`
3. `003_add_user_info_to_licenses.sql`
4. `004_create_tool_requests_table.sql`
5. `005_add_notes_to_tool_requests.sql`
6. `006_add_status_to_tool_requests.sql`
7. `007_create_password_change_requests.sql`
8. `008_create_users_table.sql`
9. `009_fix_users_trigger.sql`
10. `010_fix_admin_access_to_users.sql`
11. `011_fix_users_table_rls.sql`
12. `012_disable_users_table_rls.sql`
13. `013_create_phone_listings.sql`
14. `014_create_purchase_requests.sql`
15. `015_enable_row_level_security.sql`
16. `015_fix_purchase_requests_policies.sql`
17. `016_create_secure_functions.sql`
18. `016_create_user_wallets.sql`
19. `017_create_unlock_accounts_table.sql`
20. `017_create_wallet_functions.sql`
21. `018_fix_users_table_rls_policies.sql`
22. `019_create_tool_requests_system.sql`
23. `020_create_user_signup_trigger.sql`
24. `021_create_tools_and_requests_schema.sql`
25. `022_fix_tools_and_requests_schema.sql`
26. `023_fix_tools_schema_and_constraints.sql`
27. `024_restructure_tool_request_system.sql`
28. `025_fix_security_policies.sql`
29. `026_safe_security_policies.sql`

## النشر على Vercel

1. اربط المشروع بحساب Vercel
2. أضف متغيرات البيئة في إعدادات المشروع
3. قم بالنشر

## النشر على Netlify

1. اربط المشروع بحساب Netlify
2. أضف متغيرات البيئة في إعدادات المشروع
3. قم بالنشر

## التطوير المحلي

```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev

# بناء المشروع للإنتاج
npm run build

# تشغيل الإنتاج محلياً
npm start
```

## البنية

```
├── app/                    # صفحات Next.js
├── components/             # مكونات React
├── lib/                    # مكتبات مساعدة
├── contexts/               # React Contexts
├── hooks/                  # Custom Hooks
├── scripts/                # ملفات قاعدة البيانات
└── public/                 # الملفات الثابتة
```

## الأمان

- رؤوس أمان متقدمة
- حماية من XSS و CSRF
- Row Level Security في Supabase
- تشفير البيانات الحساسة

## الدعم

للدعم التقني، يرجى التواصل مع فريق التطوير.
