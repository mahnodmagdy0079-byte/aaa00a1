@echo off
echo ========================================
echo مساعد الرفع اليدوي على GitHub
echo ========================================
echo.

echo ========================================
echo الطريقة الأولى: رفع مباشر من GitHub
echo ========================================
echo.
echo 1. اذهب إلى: https://github.com
echo 2. سجل دخولك
echo 3. اضغط على "+" في أعلى الصفحة
echo 4. اختر "New repository"
echo 5. املأ البيانات:
echo    - Repository name: subscription-plans
echo    - Description: Tools Online - نظام إدارة الأدوات والاشتراكات
echo    - Public أو Private
echo    - لا تضع علامة على "Add a README file"
echo    - لا تضع علامة على "Add .gitignore"
echo 6. اضغط "Create repository"
echo.
echo 7. بعد إنشاء Repository:
echo    - اضغط "uploading an existing file"
echo    - اسحب وأفلت جميع الملفات من هذا المجلد
echo    - اكتب رسالة: first commit: Tools Online
echo    - اضغط "Commit changes"
echo.

echo ========================================
echo الطريقة الثانية: GitHub Desktop
echo ========================================
echo.
echo 1. افتح GitHub Desktop (تم تثبيته)
echo 2. سجل دخولك
echo 3. اضغط "Create a new repository"
echo 4. Name: subscription-plans
echo 5. اختر مجلد فارغ
echo 6. انسخ جميع الملفات من هذا المجلد
echo 7. الصقها في مجلد Repository الجديد
echo 8. في GitHub Desktop: Commit ثم Publish
echo.

echo ========================================
echo الملفات المهمة للرفع:
echo ========================================
echo.
echo ✅ ملفات المشروع:
dir /b *.json *.md *.mjs *.ts *.js 2>nul
echo.
echo ✅ مجلدات مهمة:
if exist "app" echo - app/
if exist "components" echo - components/
if exist "lib" echo - lib/
if exist "scripts" echo - scripts/
if exist "public" echo - public/
if exist "toolygsm1" echo - toolygsm1/
echo.
echo ❌ لا ترفع:
echo - node_modules/
echo - .env.local
echo - .next/
echo - bin/ و obj/
echo.

echo ========================================
echo روابط مفيدة:
echo ========================================
echo.
echo GitHub: https://github.com
echo GitHub Desktop: ابحث عن "GitHub Desktop" في Start
echo دليل مفصل: MANUAL_UPLOAD_GUIDE.md
echo.

echo اضغط أي مفتاح لفتح مجلد المشروع...
pause >nul

echo فتح مجلد المشروع...
explorer .

echo.
echo ========================================
echo تم فتح مجلد المشروع
echo ========================================
echo.
echo الآن يمكنك:
echo 1. نسخ الملفات يدوياً إلى GitHub
echo 2. أو استخدام GitHub Desktop
echo 3. أو قراءة الدليل المفصل في MANUAL_UPLOAD_GUIDE.md
echo.
pause
