# تعليمات رفع المشروع على GitHub

## المشكلة الحالية
أنت تحاول رفع المشروع إلى repository غير موجود أو ليس لديك صلاحية عليه.

## الحلول المتاحة

### الحل الأول: إنشاء Repository جديد (الأسهل)

1. **اذهب إلى GitHub:**
   - اذهب إلى [GitHub.com](https://github.com)
   - سجل دخولك كـ `mahmodmagdy0089`

2. **أنشئ Repository جديد:**
   - اضغط على **"+"** في أعلى الصفحة
   - اختر **"New repository"**
   - املأ البيانات:
     - **Repository name**: `subscription-plans` (أو أي اسم تريده)
     - **Description**: `Tools Online - نظام إدارة الأدوات والاشتراكات`
     - **Visibility**: Public أو Private (اختر ما تريد)
     - **لا تضع علامة** على "Add a README file"
     - **لا تضع علامة** على "Add .gitignore"
   - اضغط **"Create repository"**

3. **ارفع المشروع:**
   ```bash
   git push -u origin main
   ```

### الحل الثاني: استخدام اسم مختلف

إذا كان اسم `subscription-plans` مستخدم، جرب أسماء أخرى:

```bash
git remote set-url origin https://github.com/mahmodmagdy0089/tools-online.git
git push -u origin main
```

أو:

```bash
git remote set-url origin https://github.com/mahmodmagdy0089/toolygsm-system.git
git push -u origin main
```

### الحل الثالث: استخدام GitHub CLI

1. **أعد تشغيل PowerShell** (لتفعيل GitHub CLI)
2. **سجل دخولك:**
   ```bash
   gh auth login
   ```
3. **أنشئ Repository تلقائياً:**
   ```bash
   gh repo create subscription-plans --public --description "Tools Online - نظام إدارة الأدوات والاشتراكات"
   git push -u origin main
   ```

## نصائح مهمة

- تأكد من أنك مسجل دخولك بالحساب الصحيح على GitHub
- تأكد من أن اسم Repository غير مستخدم من قبل
- إذا واجهت مشكلة في الصلاحيات، تأكد من أنك تستخدم الحساب الصحيح

## الأوامر الحالية

```bash
# تحقق من الـ remote الحالي
git remote -v

# غير الـ remote URL إذا لزم الأمر
git remote set-url origin https://github.com/mahmodmagdy0089/اسم-جديد.git

# ارفع المشروع
git push -u origin main
```

## في حالة النجاح

ستحصل على رابط المشروع مثل:
`https://github.com/mahmodmagdy0089/subscription-plans`

---

**ملاحظة:** إذا استمرت المشكلة، تأكد من إنشاء Repository على GitHub أولاً قبل محاولة الرفع.
