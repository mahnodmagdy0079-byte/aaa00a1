-- تعطيل RLS على جدول المستخدمين مؤقتاً لحل مشكلة الوصول
-- Temporarily disable RLS on users table to fix access issues

-- تعطيل RLS على جدول المستخدمين
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- إضافة المستخدمين المفقودين من auth.users إلى جدول users
INSERT INTO public.users (id, email, full_name, phone, created_at, updated_at)
SELECT 
    auth.users.id,
    auth.users.email,
    COALESCE(auth.users.raw_user_meta_data->>'full_name', 'مستخدم'),
    COALESCE(auth.users.raw_user_meta_data->>'phone', ''),
    auth.users.created_at,
    NOW()
FROM auth.users
WHERE auth.users.id NOT IN (SELECT id FROM public.users WHERE id IS NOT NULL)
ON CONFLICT (id) DO NOTHING;

-- إعادة إنشاء trigger لإضافة المستخدمين الجدد تلقائياً
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.created_at,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء trigger للمستخدمين الجدد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
