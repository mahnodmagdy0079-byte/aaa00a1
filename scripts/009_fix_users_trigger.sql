-- فحص وإصلاح مشكلة عدم حفظ المستخدمين

-- أولاً: فحص المستخدمين الموجودين في auth.users
-- SELECT id, email, raw_user_meta_data FROM auth.users;

-- ثانياً: إعادة إنشاء الدالة مع معالجة أفضل للأخطاء
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- محاولة إدراج المستخدم الجديد مع معالجة الأخطاء
  BEGIN
    INSERT INTO public.users (id, email, full_name, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
  EXCEPTION WHEN OTHERS THEN
    -- في حالة حدوث خطأ، سجل الخطأ ولكن لا تفشل العملية
    RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ثالثاً: إعادة إنشاء الـ trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- رابعاً: إنشاء المستخدمين المفقودين يدوياً (إذا كانوا موجودين في auth.users)
INSERT INTO public.users (id, email, full_name, phone, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  COALESCE(au.raw_user_meta_data->>'phone', '') as phone,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- خامساً: إضافة سياسة للأدمن لقراءة جميع المستخدمين
CREATE POLICY "Admin can read all users" ON public.users
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.email = 'admin@toolygsm.com'
      )
    );
