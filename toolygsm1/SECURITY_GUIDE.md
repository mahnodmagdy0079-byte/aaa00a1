# دليل الأمان - TOOLY GSM Desktop

## 🔒 **إعدادات الأمان المطلوبة**

### **1. Environment Variables:**

#### **في Windows:**
```cmd
# إضافة متغيرات البيئة
setx SUPABASE_API_KEY "your_supabase_api_key_here"
setx API_BASE_URL "https://eskuly.org"
setx SUPABASE_BASE_URL "https://ewkzduhofisinbhjrzzu.supabase.co"
```

#### **في Linux/Mac:**
```bash
# إضافة إلى ~/.bashrc أو ~/.zshrc
export SUPABASE_API_KEY="your_supabase_api_key_here"
export API_BASE_URL="https://eskuly.org"
export SUPABASE_BASE_URL="https://ewkzduhofisinbhjrzzu.supabase.co"
```

### **2. ملف .env (اختياري):**
```env
SUPABASE_API_KEY=your_supabase_api_key_here
API_BASE_URL=https://eskuly.org
SUPABASE_BASE_URL=https://ewkzduhofisinbhjrzzu.supabase.co
LOG_LEVEL=Info
DEVELOPMENT_MODE=false
```

## 🛡️ **ميزات الأمان المضافة:**

### **1. إدارة API Keys آمنة:**
- ✅ **Environment Variables**: API keys محفوظة في متغيرات البيئة
- ✅ **No Hardcoding**: لا توجد API keys مكتوبة في الكود
- ✅ **Fallback Protection**: حماية في حالة عدم وجود متغيرات البيئة

### **2. تشفير البيانات الحساسة:**
- ✅ **DPAPI Encryption**: تشفير البيانات باستخدام Windows DPAPI
- ✅ **Memory Clearing**: تنظيف البيانات الحساسة من الذاكرة
- ✅ **Token Validation**: التحقق من صحة التوكن

### **3. Error Handling آمن:**
- ✅ **No Information Disclosure**: عدم كشف معلومات حساسة في الأخطاء
- ✅ **Secure Logging**: تسجيل الأخطاء بشكل آمن
- ✅ **User-Friendly Messages**: رسائل خطأ واضحة للمستخدم

### **4. Data Protection:**
- ✅ **Memory Cleanup**: تنظيف الذاكرة عند إغلاق البرنامج
- ✅ **Token Masking**: إخفاء التوكن في الـ logs
- ✅ **Secure Storage**: تخزين آمن للبيانات الحساسة

## 🚀 **خطوات النشر الآمن:**

### **1. إعداد Environment Variables:**
```cmd
# Windows
setx SUPABASE_API_KEY "your_actual_api_key"
setx API_BASE_URL "https://eskuly.org"
setx SUPABASE_BASE_URL "https://ewkzduhofisinbhjrzzu.supabase.co"

# إعادة تشغيل Command Prompt
```

### **2. اختبار الأمان:**
```cmd
# تشغيل البرنامج
dotnet run

# التحقق من أن API keys لا تظهر في الكود
grep -r "YOUR_SUPABASE_API_KEY" .
```

### **3. إنتاج Build آمن:**
```cmd
# بناء البرنامج للإنتاج
dotnet build -c Release

# التحقق من عدم وجود API keys في الـ executable
strings toolygsm1.exe | grep "YOUR_SUPABASE_API_KEY"
```

## 🔍 **فحص الأمان:**

### **1. التحقق من API Keys:**
- ❌ **لا يجب أن تظهر في الكود المصدري**
- ❌ **لا يجب أن تظهر في الـ executable**
- ✅ **يجب أن تكون في Environment Variables فقط**

### **2. التحقق من Error Messages:**
- ❌ **لا يجب أن تكشف تفاصيل الخطأ**
- ❌ **لا يجب أن تكشف مسارات الملفات**
- ✅ **يجب أن تكون رسائل عامة ومفيدة**

### **3. التحقق من Memory Management:**
- ✅ **يجب تنظيف البيانات الحساسة عند الإغلاق**
- ✅ **يجب استخدام SecureString للبيانات الحساسة**
- ✅ **يجب عدم تخزين كلمات المرور في الذاكرة**

## 📋 **قائمة التحقق الأمنية:**

### **قبل النشر:**
- [ ] إعداد Environment Variables
- [ ] اختبار البرنامج مع Environment Variables
- [ ] التحقق من عدم وجود API keys في الكود
- [ ] اختبار Error Handling
- [ ] اختبار Memory Cleanup

### **بعد النشر:**
- [ ] مراقبة الـ logs للأخطاء
- [ ] التحقق من عدم تسريب البيانات
- [ ] مراقبة محاولات الوصول غير المصرح بها
- [ ] تحديث API keys بانتظام

## ⚠️ **تحذيرات مهمة:**

### **1. لا تشارك Environment Variables:**
- ❌ **لا تضعها في Git**
- ❌ **لا تشاركها عبر Email**
- ❌ **لا تضعها في ملفات config عامة**

### **2. استخدم Environment Variables فقط:**
- ✅ **في الإنتاج: Environment Variables**
- ❌ **لا تستخدم ملفات .env في الإنتاج**
- ❌ **لا تكتب API keys في الكود**

### **3. مراقبة الأمان:**
- ✅ **راقب الـ logs بانتظام**
- ✅ **حدث API keys بانتظام**
- ✅ **راقب محاولات الوصول المشبوهة**

## 🆘 **في حالة تسريب API Key:**

### **1. إجراءات الطوارئ:**
1. **إلغاء API Key فوراً**
2. **إنشاء API Key جديد**
3. **تحديث Environment Variables**
4. **مراجعة الـ logs للأنشطة المشبوهة**

### **2. منع التسريب:**
1. **استخدام Environment Variables فقط**
2. **عدم مشاركة API Keys**
3. **مراجعة الكود قبل النشر**
4. **استخدام أدوات فحص الأمان**

## ✅ **الخلاصة:**

تم تطبيق جميع إجراءات الأمان الأساسية:

- 🔒 **API Keys محمية**
- 🛡️ **Error Handling آمن**
- 🔐 **Data Encryption**
- 🧹 **Memory Cleanup**
- 📝 **Secure Logging**

**البرنامج الآن آمن للنشر!** 🚀






