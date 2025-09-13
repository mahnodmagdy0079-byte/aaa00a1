#!/usr/bin/env python3
"""
سكريبت تشغيل مشاهد طلبات الأدوات
يتطلب تعيين متغيرات البيئة:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
"""

import os
import sys
import subprocess

def check_requirements():
    """التحقق من المتطلبات"""
    try:
        import requests
    except ImportError:
        print("تثبيت المتطلبات...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def check_env_vars():
    """التحقق من متغيرات البيئة"""
    required_vars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("خطأ: متغيرات البيئة التالية مفقودة:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\nيرجى تعيين هذه المتغيرات قبل تشغيل التطبيق")
        return False
    
    return True

def main():
    """الدالة الرئيسية"""
    print("🔧 TOOLY GSM - مشاهد طلبات الأدوات")
    print("=" * 40)
    
    # التحقق من المتطلبات
    check_requirements()
    
    # التحقق من متغيرات البيئة
    if not check_env_vars():
        return
    
    # تشغيل التطبيق
    print("تشغيل التطبيق...")
    from tool_requests_viewer import main as run_app
    run_app()

if __name__ == "__main__":
    main()
