@echo off
echo ========================================
echo تحديث برنامج Tooly GSM للعمل مع RLS
echo ========================================
echo.

echo جاري نسخ الملفات المحدثة...
copy "Form1_Updated.cs" "Form1.cs" /Y
if %errorlevel% neq 0 (
    echo خطأ في نسخ Form1.cs
    pause
    exit /b 1
)

echo تم نسخ Form1.cs بنجاح

echo.
echo جاري حذف الملفات المؤقتة...
del "Form1_Updated.cs" /Q
if %errorlevel% neq 0 (
    echo تحذير: لم يتم حذف Form1_Updated.cs
)

echo.
echo ========================================
echo تم التحديث بنجاح!
echo ========================================
echo.
echo يمكنك الآن بناء المشروع وتشغيله
echo.
pause




