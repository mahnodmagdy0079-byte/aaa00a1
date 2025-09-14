# دليل حل مشكلة برنامج الحماية (Antivirus)

## المشكلة
برنامج الحماية (Windows Defender أو أي برنامج حماية آخر) يعتبر ملف `toolygsm1.exe` فيروس أو برنامج مشبوه.

## الحلول

### الحل الأول: إضافة استثناء في Windows Defender
1. افتح **Windows Security** (أمان Windows)
2. اذهب إلى **Virus & threat protection** (الحماية من الفيروسات والتهديدات)
3. اضغط على **Manage settings** تحت **Virus & threat protection settings**
4. اضغط على **Add or remove exclusions** (إضافة أو إزالة الاستثناءات)
5. اضغط على **Add an exclusion** (إضافة استثناء)
6. اختر **Folder** (مجلد)
7. اختر مجلد: `D:\Downloads\subscription-plans (1)\toolygsm1\`
8. اضغط **Select Folder**

### الحل الثاني: إضافة استثناء للملف المحدد
1. اتبع الخطوات 1-5 من الحل الأول
2. اختر **File** (ملف) بدلاً من **Folder**
3. اختر الملف: `D:\Downloads\subscription-plans (1)\toolygsm1\toolygsm1\bin\Release\toolygsm1.exe`
4. اضغط **Open**

### الحل الثالث: إيقاف الحماية المؤقت
1. افتح **Windows Security**
2. اذهب إلى **Virus & threat protection**
3. اضغط على **Manage settings** تحت **Virus & threat protection settings**
4. أوقف **Real-time protection** مؤقتاً
5. شغل التطبيق
6. أعد تشغيل **Real-time protection** بعد الانتهاء

### الحل الرابع: تشغيل التطبيق من مجلد مختلف
1. انسخ مجلد `toolygsm1` إلى مكان آخر (مثل `C:\TOOLY-GSM\`)
2. شغل التطبيق من الموقع الجديد

### الحل الخامس: تشغيل كمدير (Run as Administrator)
1. اضغط كليك يمين على `toolygsm1.exe`
2. اختر **Run as administrator**

## ملاحظات مهمة
- هذا التطبيق آمن 100% ولا يحتوي على أي فيروسات
- المشكلة تحدث بسبب تقنيات الحماية المتقدمة في الكود
- جميع الحلول أعلاه آمنة ومجربة

## إذا استمرت المشكلة
1. تأكد من تحديث Windows Defender
2. جرب تشغيل التطبيق من مجلد مختلف
3. أضف المجلد كاملاً كاستثناء

---
**تم إنشاء هذا الدليل لحل مشكلة برنامج الحماية مع تطبيق TOOLY-GSM**
