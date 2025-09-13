-- إصلاح صلاحيات الوصول لجدول المستخدمين للأدمن
-- Fix admin access permissions to users table

-- إضافة سياسة للسماح للأدمن بقراءة جميع المستخدمين
-- Add policy to allow admin to read all users
CREATE POLICY "Allow admin to read all users" ON public.users
FOR SELECT
USING (
  -- يمكن للأدمن الوصول إذا كان لديه ترخيص نشط
  -- Admin can access if they have an active license
  EXISTS (
    SELECT 1 FROM public.licenses 
    WHERE user_name = (
      SELECT full_name FROM public.users 
      WHERE id = auth.uid()
    )
    AND end_date > NOW()
  )
  OR
  -- أو إذا كان المستخدم الحالي هو نفسه
  -- Or if the current user is accessing their own record
  auth.uid() = id
);

-- إضافة سياسة للسماح بإدراج المستخدمين الجدد
-- Add policy to allow inserting new users
CREATE POLICY "Allow authenticated users to insert" ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- إضافة سياسة للسماح بتحديث المستخدمين
-- Add policy to allow updating users
CREATE POLICY "Allow users to update own profile" ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- التأكد من وجود المستخدمين من auth.users في جدول users
-- Ensure users from auth.users exist in users table
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- إنشاء دالة للتحقق من صلاحيات الأدمن
-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- التحقق من وجود ترخيص نشط للمستخدم الحالي
  -- Check if current user has an active license
  RETURN EXISTS (
    SELECT 1 FROM public.licenses l
    JOIN public.users u ON l.user_name = u.full_name
    WHERE u.id = auth.uid()
    AND l.end_date > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تحديث السياسة لاستخدام دالة is_admin
-- Update policy to use is_admin function
DROP POLICY IF EXISTS "Allow admin to read all users" ON public.users;
CREATE POLICY "Allow admin to read all users" ON public.users
FOR SELECT
USING (
  is_admin() OR auth.uid() = id
);
