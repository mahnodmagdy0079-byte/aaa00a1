-- إنشاء جدول التراخيص
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key TEXT NOT NULL UNIQUE,
  plan_name TEXT NOT NULL, -- تغيير من package_name إلى plan_name
  plan_price TEXT NOT NULL, -- تغيير من package_price إلى plan_price
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL, -- تغيير من end_date إلى expiry_date
  is_active BOOLEAN DEFAULT true, -- إضافة حقل is_active
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان - السماح للجميع بالقراءة (للأدمن)
CREATE POLICY "Allow read access to licenses" ON public.licenses FOR SELECT USING (true);

-- السماح بالإدراج للجميع (للأدمن)
CREATE POLICY "Allow insert access to licenses" ON public.licenses FOR INSERT WITH CHECK (true);

-- السماح بالتحديث للجميع (للأدمن)
CREATE POLICY "Allow update access to licenses" ON public.licenses FOR UPDATE USING (true);

-- السماح بالحذف للجميع (للأدمن)
CREATE POLICY "Allow delete access to licenses" ON public.licenses FOR DELETE USING (true);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_plan_name ON public.licenses(plan_name); -- تحديث اسم الفهرس
CREATE INDEX IF NOT EXISTS idx_licenses_created_at ON public.licenses(created_at);
CREATE INDEX IF NOT EXISTS idx_licenses_is_active ON public.licenses(is_active); -- إضافة فهرس للحقل الجديد

-- إدراج بيانات تجريبية للاختبار
INSERT INTO public.licenses (license_key, plan_name, plan_price, expiry_date) VALUES
('E6Q6-SENO-KHVO-OTOC', 'الباقة الكبيرة', '600 جنيه شهرياً', NOW() + INTERVAL '30 days'),
('TEST-1234-ABCD-EFGH', 'الباقة المتوسطة', '400 جنيه شهرياً', NOW() + INTERVAL '30 days'),
('DEMO-5678-IJKL-MNOP', 'الباقة الصغيرة', '100 جنيه أسبوعياً', NOW() + INTERVAL '7 days')
ON CONFLICT (license_key) DO NOTHING;
