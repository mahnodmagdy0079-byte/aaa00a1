# Tools Online - نظام إدارة الأدوات والاشتراكات

## 📋 نظرة عامة

نظام شامل لإدارة الأدوات والاشتراكات مع واجهة ويب حديثة وتطبيق سطح مكتب. يوفر النظام إدارة كاملة للمستخدمين والتراخيص والمحافظ والطلبات.

## 🚀 الميزات الرئيسية

### 🌐 الموقع الإلكتروني
- **واجهة مستخدم حديثة** مع Next.js 14 و TypeScript
- **نظام مصادقة آمن** مع Supabase Auth
- **إدارة المستخدمين** والتراخيص والمحافظ
- **لوحة تحكم إدارية** شاملة
- **نظام دفع متكامل** مع إدارة الرصيد
- **أمان متقدم** مع Row Level Security (RLS)

### 💻 تطبيق سطح المكتب
- **واجهة مستخدم جذابة** مع Guna UI2
- **تسجيل دخول آمن** مع JWT Token
- **عرض البيانات** في الوقت الفعلي
- **شراء الأدوات** مباشرة من التطبيق
- **سجل الطلبات** والأنشطة

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14** - إطار عمل React
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - تصميم الواجهة
- **Shadcn/ui** - مكونات الواجهة
- **Lucide React** - الأيقونات

### Backend
- **Supabase** - قاعدة البيانات والمصادقة
- **PostgreSQL** - قاعدة البيانات
- **Row Level Security** - الأمان
- **JWT Tokens** - المصادقة

### Desktop App
- **C# WinForms** - تطبيق سطح المكتب
- **Guna UI2** - مكونات الواجهة
- **Newtonsoft.Json** - معالجة JSON
- **HttpClient** - الاتصال بالـ API

## 📁 هيكل المشروع

```
├── app/                    # صفحات Next.js
│   ├── admin/             # لوحة التحكم الإدارية
│   ├── api/               # API endpoints
│   ├── auth/              # صفحات المصادقة
│   ├── dashboard/         # لوحة تحكم المستخدم
│   └── ...
├── components/            # مكونات React
├── lib/                   # مكتبات مساعدة
├── scripts/               # سكريبتات قاعدة البيانات
├── toolygsm1/            # تطبيق سطح المكتب
└── public/               # الملفات الثابتة
```

## 🚀 التثبيت والتشغيل

### متطلبات النظام
- Node.js 18+
- .NET Framework 4.8+
- Visual Studio 2022 (للتطبيق)
- حساب Supabase

### 1. إعداد الموقع الإلكتروني

```bash
# استنساخ المشروع
git clone https://github.com/mahnodmagdy0079-byte/toolsonline.git
cd toolsonline

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# قم بتعديل .env.local مع بيانات Supabase

# تشغيل المشروع
npm run dev
```

### 2. إعداد قاعدة البيانات

```bash
# تشغيل سكريبتات قاعدة البيانات
# قم بتشغيل الملفات في مجلد scripts/ بالترتيب
```

### 3. إعداد تطبيق سطح المكتب

```bash
# فتح المشروع في Visual Studio
cd toolygsm1
# فتح toolygsm1.sln

# بناء المشروع
# Build → Rebuild Solution

# تشغيل التطبيق
# F5 أو Ctrl+F5
```

## 🔧 التكوين

### متغيرات البيئة

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

### إعدادات التطبيق

```csharp
// في ملف models.cs
public static class SupabaseConfig
{
    public const string BaseUrl = "https://your-domain.com";
    public const string ApiKey = "your_api_key";
}
```

## 📊 قاعدة البيانات

### الجداول الرئيسية

- **users** - بيانات المستخدمين
- **licenses** - التراخيص والاشتراكات
- **user_wallets** - محافظ المستخدمين
- **tool_requests** - طلبات الأدوات
- **tools** - قائمة الأدوات المتاحة
- **purchase_requests** - طلبات الشراء

### الأمان

- **Row Level Security (RLS)** مفعل على جميع الجداول
- **سياسات أمان** مخصصة لكل جدول
- **JWT Tokens** للمصادقة
- **Rate Limiting** للحماية من الهجمات

## 🔐 الأمان

### الميزات الأمنية

- ✅ **Row Level Security** - حماية البيانات على مستوى الصف
- ✅ **JWT Authentication** - مصادقة آمنة
- ✅ **Rate Limiting** - حماية من الهجمات
- ✅ **Input Validation** - التحقق من المدخلات
- ✅ **CORS Protection** - حماية من الطلبات المباشرة
- ✅ **Security Headers** - رؤوس أمان متقدمة

## 📱 API Endpoints

### المصادقة
```
POST /api/auth/signin     # تسجيل الدخول
POST /api/auth/signup     # تسجيل حساب جديد
```

### المستخدمين
```
GET  /api/users/profile   # بيانات المستخدم
PUT  /api/users/profile   # تحديث البيانات
```

### التراخيص
```
POST /api/license/check   # فحص الترخيص
GET  /api/license/info    # معلومات الترخيص
```

### المحافظ
```
POST /api/wallet/balance  # رصيد المحفظة
POST /api/wallet/add      # إضافة رصيد
```

### الطلبات
```
POST /api/tool-requests/create   # إنشاء طلب
POST /api/tool-requests/history  # سجل الطلبات
```

## 🎨 التصميم

### نظام الألوان
- **البرتقالي**: `#FF6B35` - اللون الأساسي
- **الرمادي الداكن**: `#1B1B1B` - الخلفية
- **الرمادي الفاتح**: `#2A2A2A` - العناصر
- **الأبيض**: `#FFFFFF` - النصوص

### الخطوط
- **Segoe UI** - الخط الأساسي
- **Inter** - خط الواجهة

## 🚀 النشر

### Vercel (الموقع)
```bash
# ربط المشروع بـ Vercel
vercel

# النشر
vercel --prod
```

### تطبيق سطح المكتب
```bash
# بناء الإصدار النهائي
# Build → Publish

# إنشاء ملف التثبيت
# Publish → Create Setup
```

## 📈 المراقبة والأداء

### المراقبة
- **Supabase Dashboard** - مراقبة قاعدة البيانات
- **Vercel Analytics** - إحصائيات الموقع
- **Console Logs** - سجلات التطبيق

### الأداء
- **Next.js Optimization** - تحسين الأداء
- **Image Optimization** - تحسين الصور
- **Code Splitting** - تقسيم الكود
- **Caching** - التخزين المؤقت

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

- **الموقع**: [toolygsm.com](https://toolygsm.com)
- **WhatsApp**: [تواصل معنا](https://wa.me/201098049153)
- **Telegram**: [@toolygsm](https://t.me/toolygsm)
- **Facebook**: [Tooly GSM](https://facebook.com/toolygsm)

## 🙏 شكر وتقدير

- **Supabase** - قاعدة البيانات والمصادقة
- **Vercel** - استضافة الموقع
- **Next.js Team** - إطار العمل
- **Guna UI** - مكونات سطح المكتب

---

**تم التطوير بـ ❤️ بواسطة فريق Tooly GSM**

