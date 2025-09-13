@echo off
echo ========================================
echo رفع المشروع على GitHub
echo ========================================
echo.

echo جاري التحقق من Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo خطأ: Git غير مثبت على النظام
    echo يرجى تثبيت Git من: https://git-scm.com/download/win
    echo ثم تشغيل هذا الملف مرة أخرى
    pause
    exit /b 1
)

echo Git مثبت بنجاح
echo.

echo جاري تهيئة Git repository...
git init
if %errorlevel% neq 0 (
    echo خطأ في تهيئة Git repository
    pause
    exit /b 1
)

echo تم تهيئة Git repository بنجاح
echo.

echo جاري إضافة جميع الملفات...
git add .
if %errorlevel% neq 0 (
    echo خطأ في إضافة الملفات
    pause
    exit /b 1
)

echo تم إضافة الملفات بنجاح
echo.

echo جاري إنشاء commit أول...
git commit -m "first commit: Tools Online - نظام إدارة الأدوات والاشتراكات"
if %errorlevel% neq 0 (
    echo خطأ في إنشاء commit
    pause
    exit /b 1
)

echo تم إنشاء commit بنجاح
echo.

echo جاري تغيير اسم الفرع الرئيسي إلى main...
git branch -M main
if %errorlevel% neq 0 (
    echo خطأ في تغيير اسم الفرع
    pause
    exit /b 1
)

echo تم تغيير اسم الفرع إلى main
echo.

echo جاري إضافة remote repository...
git remote add origin https://github.com/mahnodmagdy0079-byte/toolsonline.git
if %errorlevel% neq 0 (
    echo تحذير: قد يكون remote repository موجود بالفعل
    echo جاري تحديث URL...
    git remote set-url origin https://github.com/mahnodmagdy0079-byte/toolsonline.git
)

echo تم إضافة remote repository
echo.

echo جاري رفع المشروع على GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo خطأ في رفع المشروع
    echo تأكد من:
    echo 1. صحة بيانات GitHub
    echo 2. وجود repository على GitHub
    echo 3. صلاحيات الوصول
    pause
    exit /b 1
)

echo.
echo ========================================
echo تم رفع المشروع على GitHub بنجاح! 🎉
echo ========================================
echo.
echo يمكنك الآن زيارة المشروع على:
echo https://github.com/mahnodmagdy0079-byte/toolsonline
echo.
pause
