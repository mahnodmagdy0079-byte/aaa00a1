# تحليل تدفق البيانات في الموقع - TOOLY GSM

## 🔄 تدفق البيانات العام

### 1. تسجيل الدخول (Authentication Flow)

```
المستخدم → صفحة تسجيل الدخول → API → Supabase Auth → JWT Token → Dashboard
```

**التفاصيل:**
1. **Frontend**: `app/auth/signin/page.tsx`
   - المستخدم يدخل البريد الإلكتروني وكلمة المرور
   - يرسل POST request إلى `/api/auth/signin`

2. **API**: `app/api/auth/signin/route.ts`
   - يتحقق من البيانات مع Supabase Auth
   - ينشئ JWT token
   - يحفظ التوكن في HttpOnly cookie
   - يرجع بيانات المستخدم والتوكن

3. **Frontend**: يحفظ التوكن في localStorage
   - `localStorage.setItem("token", result.token)`
   - `localStorage.setItem("user", JSON.stringify(result.user))`

### 2. جلب بيانات المستخدم (User Data Fetching)

#### أ) رصيد المحفظة (Wallet Balance)

```
Dashboard → /api/wallet/balance → JWT Decode → Supabase → user_wallets table
```

**التفاصيل:**
1. **Frontend**: `app/dashboard/page.tsx` (السطر 314-333)
   ```typescript
   const walletRes = await fetch("/api/wallet/balance", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${token}`,
     },
     body: JSON.stringify({ user_id: currentUser.id })
   })
   ```

2. **API**: `app/api/wallet/balance/route.ts`
   - يتحقق من JWT token
   - يستخرج `user_id` من التوكن
   - يبحث في جدول `user_wallets` بالـ `user_id`
   - يرجع الرصيد

3. **Database**: جدول `user_wallets`
   ```sql
   SELECT balance FROM user_wallets WHERE user_id = ?
   ```

#### ب) بيانات الترخيص (License Data)

```
Dashboard → /api/license/check → JWT Decode → Supabase → licenses table
```

**التفاصيل:**
1. **Frontend**: `app/dashboard/page.tsx` (السطر 343-359)
   ```typescript
   const licenseRes = await fetch("/api/license/check", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${token}`,
     },
   })
   ```

2. **API**: `app/api/license/check/route.ts`
   - يتحقق من JWT token
   - يستخرج `user_email` من التوكن
   - يبحث في جدول `licenses` بالـ `user_email`
   - يتحقق من تاريخ الانتهاء
   - يرجع بيانات الترخيص

3. **Database**: جدول `licenses`
   ```sql
   SELECT * FROM licenses WHERE user_email = ? AND end_date >= NOW()
   ```

#### ج) الأدوات المتاحة (Available Tools)

```
Dashboard → Supabase Client → tools table
```

**التفاصيل:**
1. **Frontend**: `app/dashboard/page.tsx` (السطر 294-298)
   ```typescript
   const { data: tools, error: toolsError } = await supabase
     .from("tools")
     .select("*")
     .order("name")
   ```

2. **Database**: جدول `tools`
   ```sql
   SELECT * FROM tools ORDER BY name
   ```

#### د) طلبات الأدوات النشطة (Active Tool Requests)

```
Dashboard → getActiveToolRequestsAction → Supabase → tool_requests table
```

**التفاصيل:**
1. **Frontend**: `app/dashboard/page.tsx` (السطر 303-307)
   ```typescript
   const activeToolsResult = await getActiveToolRequestsAction(currentUser.email)
   ```

2. **Action**: `app/dashboard/actions.ts` (السطر 95-120)
   ```typescript
   const { data: toolRequests, error } = await supabase
     .from("tool_requests")
     .select("*")
     .eq("user_email", userEmail)
     .gte("end_time", new Date().toISOString())
     .order("created_at", { ascending: false })
   ```

3. **Database**: جدول `tool_requests`
   ```sql
   SELECT * FROM tool_requests 
   WHERE user_email = ? AND end_time >= NOW() 
   ORDER BY created_at DESC
   ```

## 🗄️ هيكل قاعدة البيانات

### الجداول الرئيسية:

1. **`users`** - بيانات المستخدمين
   - `id`, `email`, `full_name`, `phone`, `created_at`

2. **`licenses`** - تراخيص المستخدمين
   - `license_key`, `user_name`, `user_email`, `package_name`, `start_date`, `end_date`

3. **`user_wallets`** - محافظ المستخدمين
   - `user_id`, `user_email`, `balance`, `created_at`, `updated_at`

4. **`tools`** - الأدوات المتاحة
   - `id`, `name`, `image_url`, `price`, `duration_hours`, `requires_credit`

5. **`tool_requests`** - طلبات الأدوات
   - `id`, `user_email`, `tool_name`, `device_id`, `status`, `start_time`, `end_time`

6. **`tool_accounts`** - حسابات الأدوات
   - `id`, `tool_name`, `account_username`, `account_password`, `is_available`

## 🔐 الأمان والحماية

### 1. JWT Authentication
- جميع API calls تتطلب JWT token
- التوكن يحتوي على `user_id` و `user_email`
- مدة صلاحية التوكن: 7 أيام

### 2. Rate Limiting
- حماية من spam requests
- حد أقصى 5 طلبات مصادقة في الدقيقة
- حد أقصى 20 طلب API عادي في الدقيقة

### 3. CORS Protection
- إعدادات CORS محسنة للإنتاج
- دعم OPTIONS method لجميع API routes

### 4. Row Level Security (RLS)
- حماية على مستوى الصفوف في Supabase
- المستخدمون يرون فقط بياناتهم

## 📊 تدفق البيانات في Dashboard

```
1. تحميل الصفحة
   ↓
2. جلب بيانات المستخدم من localStorage
   ↓
3. التحقق من صحة التوكن
   ↓
4. جلب رصيد المحفظة من API
   ↓
5. جلب بيانات الترخيص من API
   ↓
6. جلب الأدوات المتاحة من Supabase
   ↓
7. جلب طلبات الأدوات النشطة
   ↓
8. عرض البيانات في الواجهة
```

## 🚀 الأداء والتحسين

### 1. Caching
- بيانات المستخدم محفوظة في localStorage
- تقليل API calls المتكررة

### 2. Error Handling
- معالجة شاملة للأخطاء
- رسائل خطأ واضحة للمستخدم

### 3. Loading States
- مؤشرات تحميل لجميع العمليات
- تجربة مستخدم محسنة

## 🔧 استكشاف الأخطاء

### مشاكل شائعة:

1. **"Invalid token"**: التوكن منتهي الصلاحية أو غير صحيح
2. **"Wallet not found"**: المستخدم ليس له محفظة
3. **"No license found"**: المستخدم ليس له ترخيص نشط
4. **"Rate limit exceeded"**: تجاوز الحد المسموح من الطلبات

### حلول:

1. **إعادة تسجيل الدخول** لتجديد التوكن
2. **إنشاء محفظة** للمستخدم الجديد
3. **شراء ترخيص** أو تجديد الترخيص المنتهي
4. **الانتظار** حتى انتهاء فترة Rate limiting

---

**ملاحظة**: هذا التحليل يوضح كيف يعمل الموقع بشكل كامل مع قاعدة البيانات والـ API، مما يضمن تجربة مستخدم سلسة وآمنة.
