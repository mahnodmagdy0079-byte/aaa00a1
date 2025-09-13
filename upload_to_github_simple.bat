@echo off
echo ========================================
echo رفع المشروع على GitHub - الطريقة المبسطة
echo ========================================
echo.

echo جاري التحقق من Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo خطأ: Git غير مثبت على النظام
    pause
    exit /b 1
)

echo Git مثبت بنجاح
echo.

echo جاري التحقق من حالة Git...
git status
echo.

echo ========================================
echo تعليمات إنشاء Repository على GitHub:
echo ========================================
echo.
echo 1. اذهب إلى https://github.com
echo 2. سجل دخولك
echo 3. اضغط على "+" في أعلى الصفحة
echo 4. اختر "New repository"
echo 5. املأ البيانات:
echo    - Repository name: subscription-plans
echo    - Description: Tools Online - نظام إدارة الأدوات والاشتراكات
echo    - Public أو Private (اختر ما تريد)
echo    - لا تضع علامة على "Add a README file"
echo    - لا تضع علامة على "Add .gitignore"
echo 6. اضغط "Create repository"
echo.
echo بعد إنشاء Repository، اضغط أي مفتاح للمتابعة...
pause

echo.
echo جاري محاولة رفع المشروع...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo تم رفع المشروع على GitHub بنجاح! 🎉
    echo ========================================
    echo.
    echo يمكنك الآن زيارة المشروع على:
    echo https://github.com/mahmodmagdy0089/subscription-plans
) else (
    echo.
    echo ========================================
    echo فشل في رفع المشروع
    echo ========================================
    echo.
    echo تأكد من:
    echo 1. إنشاء Repository على GitHub
    echo 2. صحة اسم المستخدم
    echo 3. صلاحيات الوصول
    echo.
    echo جرب إنشاء Repository باسم مختلف
)

echo.
pause
