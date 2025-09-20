# 🔒 دليل إعداد Environment Variables - TOOLY GSM

## ⚠️ **تحذير أمني مهم**
تم إصلاح مشكلة تسريب API Keys من الكود المصدري. الآن يجب إعداد Environment Variables قبل تشغيل التطبيق.

---

## 🚀 **خطوات الإعداد السريع**

### **1. إعداد Environment Variables في Windows:**

```cmd
# افتح Command Prompt كـ Administrator
# ثم نفذ الأوامر التالية:

setx SUPABASE_API_KEY "your_actual_supabase_api_key_here"
setx API_BASE_URL "https://eskuly.org"
setx SUPABASE_BASE_URL "https://ewkzduhofisinbhjrzzu.supabase.co"
setx JWT_SECRET "your_jwt_secret_here"

# إعادة تشغيل Command Prompt بعد تعيين المتغيرات
```

### **2. إعداد Environment Variables في Linux/Mac:**

```bash
# أضف إلى ~/.bashrc أو ~/.zshrc
export SUPABASE_API_KEY="your_actual_supabase_api_key_here"
export API_BASE_URL="https://eskuly.org"
export SUPABASE_BASE_URL="https://ewkzduhofisinbhjrzzu.supabase.co"
export JWT_SECRET="your_jwt_secret_here"

# إعادة تحميل الملف
source ~/.bashrc
```

### **3. إعداد Environment Variables في Next.js:**

```bash
# انسخ ملف القالب
cp env.template .env

# عدّل ملف .env بالقيم الصحيحة
nano .env
```

---

## 🔍 **التحقق من الإعداد**

### **اختبار Environment Variables:**

```bash
# Windows
echo %SUPABASE_API_KEY%

# Linux/Mac
echo $SUPABASE_API_KEY
```

### **اختبار التطبيق:**

```bash
# تشغيل التطبيق المكتبي
dotnet run

# تشغيل موقع Next.js
npm run dev
```

---

## 🛡️ **أفضل الممارسات الأمنية**

### **1. إدارة المفاتيح السرية:**
- ✅ استخدم Environment Variables فقط
- ❌ لا تضع المفاتيح في الكود المصدري
- ❌ لا تضع المفاتيح في Git
- ❌ لا تشارك المفاتيح عبر Email

### **2. فصل البيئات:**
- 🔧 **Development**: قيم للتطوير
- 🚀 **Production**: قيم للإنتاج
- 🧪 **Testing**: قيم للاختبار

### **3. تحديث المفاتيح:**
- 🔄 حدث المفاتيح كل 3-6 أشهر
- 📝 احتفظ بسجل للتغييرات
- 🚨 راقب الأنشطة المشبوهة

---

## 🆘 **استكشاف الأخطاء**

### **خطأ: "SUPABASE_API_KEY environment variable is not set"**

**الحل:**
1. تأكد من تعيين Environment Variable
2. أعد تشغيل Terminal/Command Prompt
3. تحقق من صحة اسم المتغير

### **خطأ: "Invalid API Key"**

**الحل:**
1. تحقق من صحة API Key
2. تأكد من نسخ المفتاح كاملاً
3. تحقق من عدم وجود مسافات إضافية

### **خطأ: "Connection failed"**

**الحل:**
1. تحقق من الاتصال بالإنترنت
2. تحقق من صحة URLs
3. تحقق من إعدادات Firewall

---

## 📋 **قائمة التحقق**

### **قبل النشر:**
- [ ] تعيين جميع Environment Variables
- [ ] اختبار التطبيق مع Environment Variables
- [ ] التحقق من عدم وجود API Keys في الكود
- [ ] اختبار جميع الوظائف
- [ ] مراجعة ملفات التوثيق

### **بعد النشر:**
- [ ] مراقبة الـ logs للأخطاء
- [ ] التحقق من عمل التطبيق بشكل صحيح
- [ ] مراقبة محاولات الوصول المشبوهة
- [ ] تحديث المفاتيح بانتظام

---

## ✅ **الخلاصة**

تم إصلاح مشكلة تسريب API Keys بنجاح! 

**الآن التطبيق آمن ويطلب Environment Variables قبل التشغيل.**

**تذكر:**
- 🔒 **الأمان أولاً**: لا تضع المفاتيح في الكود
- 🔄 **التحديث المستمر**: حدث المفاتيح بانتظام
- 📝 **التوثيق**: احتفظ بسجل للتغييرات
- 🚨 **المراقبة**: راقب الأنشطة المشبوهة

**التطبيق الآن جاهز للنشر الآمن!** 🚀
