#!/bin/bash

# سكريبت إعداد مشاهد طلبات الأدوات

echo "🔧 TOOLY GSM - إعداد مشاهد طلبات الأدوات"
echo "============================================"

# التحقق من Python
if ! command -v python3 &> /dev/null; then
    echo "خطأ: Python 3 غير مثبت"
    exit 1
fi

# تثبيت المتطلبات
echo "تثبيت المتطلبات..."
pip3 install -r requirements.txt

# إنشاء ملف متغيرات البيئة
if [ ! -f .env ]; then
    echo "إنشاء ملف .env..."
    cat > .env << EOF
# متغيرات البيئة لمشاهد طلبات الأدوات
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF
    echo "تم إنشاء ملف .env - يرجى تحديث القيم"
fi

echo "تم الإعداد بنجاح!"
echo "لتشغيل التطبيق: python3 run_viewer.py"
