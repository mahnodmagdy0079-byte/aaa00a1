-- إضافة حقول اسم المستخدم ورقم الهاتف لجدول التراخيص
ALTER TABLE public.licenses 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- إضافة فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_licenses_user_name ON public.licenses(user_name);
CREATE INDEX IF NOT EXISTS idx_licenses_phone_number ON public.licenses(phone_number);

-- تحديث البيانات التجريبية الموجودة
UPDATE public.licenses 
SET user_name = 'مستخدم تجريبي', phone_number = '01234567890'
WHERE user_name IS NULL;
