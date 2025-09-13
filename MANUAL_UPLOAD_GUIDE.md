# دليل رفع الملفات يدوياً على GitHub

## الطريقة الأولى: رفع مباشر من GitHub (الأسهل)

### 1. إنشاء Repository جديد:
1. اذهب إلى [GitHub.com](https://github.com)
2. سجل دخولك
3. اضغط على **"+"** في أعلى الصفحة
4. اختر **"New repository"**
5. املأ البيانات:
   - **Repository name**: `subscription-plans`
   - **Description**: `Tools Online - نظام إدارة الأدوات والاشتراكات`
   - **Public** أو **Private**
   - **لا تضع علامة** على "Add a README file"
   - **لا تضع علامة** على "Add .gitignore"
6. اضغط **"Create repository"**

### 2. رفع الملفات:
بعد إنشاء Repository:
1. **اضغط "uploading an existing file"** أو **"upload files"**
2. **اسحب وأفلت** جميع الملفات من مجلد المشروع
3. **أو اضغط "choose your files"** واختر الملفات
4. **اكتب رسالة commit:** `first commit: Tools Online - نظام إدارة الأدوات والاشتراكات`
5. **اضغط "Commit changes"**

## الطريقة الثانية: GitHub Desktop (الأسهل للمبتدئين)

### 1. فتح GitHub Desktop:
- ابحث عن "GitHub Desktop" في قائمة Start
- افتح التطبيق

### 2. تسجيل الدخول:
- سجل دخولك بحساب GitHub

### 3. إنشاء Repository:
- اضغط **"Create a new repository on your hard drive"**
- **Name**: `subscription-plans`
- **Description**: `Tools Online - نظام إدارة الأدوات والاشتراكات`
- **Local path**: اختر مجلد فارغ (مثل `C:\GitHub\subscription-plans`)
- **Initialize with README**: لا تضع علامة
- اضغط **"Create repository"**

### 4. نسخ الملفات:
- انسخ جميع الملفات من مجلد المشروع الحالي
- الصقها في مجلد Repository الجديد

### 5. رفع الملفات:
- في GitHub Desktop، ستظهر الملفات الجديدة
- اكتب رسالة commit: `first commit: Tools Online - نظام إدارة الأدوات والاشتراكات`
- اضغط **"Commit to main"**
- اضغط **"Publish repository"**

## الطريقة الثالثة: استخدام Git Bash

### 1. فتح Git Bash:
- ابحث عن "Git Bash" في قائمة Start
- افتح التطبيق

### 2. الانتقال لمجلد المشروع:
```bash
cd /d/Downloads/subscription-plans\ \(1\)
```

### 3. رفع الملفات:
```bash
git push -u origin main
```

## الطريقة الرابعة: استخدام Visual Studio Code

### 1. فتح المشروع في VS Code:
- افتح Visual Studio Code
- اضغط **File > Open Folder**
- اختر مجلد المشروع

### 2. استخدام Source Control:
- اضغط على أيقونة Source Control في الشريط الجانبي
- اكتب رسالة commit
- اضغط **"Commit"**
- اضغط **"Sync Changes"**

## الطريقة الخامسة: استخدام Command Line (الأصعب)

### 1. فتح Command Prompt أو PowerShell:
```cmd
cd "D:\Downloads\subscription-plans (1)"
```

### 2. رفع الملفات:
```cmd
git push -u origin main
```

## نصائح مهمة:

### قبل الرفع:
- تأكد من إنشاء Repository على GitHub أولاً
- تأكد من أن جميع الملفات المهمة موجودة
- تأكد من أن الملفات الحساسة (مثل `.env`) غير موجودة

### الملفات المهمة للرفع:
- ✅ جميع ملفات `.tsx`, `.ts`, `.js`
- ✅ ملفات `.json` (package.json, tsconfig.json)
- ✅ مجلد `components/`
- ✅ مجلد `app/`
- ✅ مجلد `lib/`
- ✅ مجلد `scripts/`
- ✅ مجلد `public/`
- ✅ ملف `README.md`
- ✅ ملف `.gitignore`

### الملفات التي لا يجب رفعها:
- ❌ مجلد `node_modules/`
- ❌ ملف `.env.local`
- ❌ مجلد `.next/`
- ❌ ملفات `.log`
- ❌ مجلد `bin/` و `obj/` (للمشاريع C#)

## في حالة وجود مشاكل:

### مشكلة الصلاحيات:
- تأكد من تسجيل الدخول بالحساب الصحيح
- تأكد من أن Repository موجود

### مشكلة حجم الملفات:
- GitHub له حد أقصى 100MB للملف الواحد
- إذا كان لديك ملفات كبيرة، استخدم Git LFS

### مشكلة سرعة الرفع:
- استخدم اتصال إنترنت مستقر
- جرب رفع الملفات على دفعات

---

## التوصية:

**للبدء:** استخدم **الطريقة الأولى** (رفع مباشر من GitHub) - الأسهل والأسرع
**للمشاريع المستقبلية:** استخدم **GitHub Desktop** - أسهل في الإدارة

---

**بعد الرفع الناجح، ستجد مشروعك على:**
`https://github.com/mahmodmagdy0089/subscription-plans`
