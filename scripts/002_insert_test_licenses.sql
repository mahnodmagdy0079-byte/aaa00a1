-- إدراج بيانات تجريبية للتراخيص
-- إذا كانت البيانات موجودة، سيتم تحديثها

-- حذف البيانات التجريبية الموجودة (إن وجدت)
DELETE FROM public.licenses WHERE license_key IN ('E6Q6-SENO-KHVO-OTOC', 'TEST-1234-ABCD-EFGH', 'DEMO-5678-IJKL-MNOP');

-- إدراج البيانات التجريبية الجديدة
INSERT INTO public.licenses (license_key, plan_name, plan_price, expiry_date, is_active) VALUES
('E6Q6-SENO-KHVO-OTOC', 'الباقة الكبيرة', 600, NOW() + INTERVAL '30 days', true),
('TEST-1234-ABCD-EFGH', 'الباقة المتوسطة', 400, NOW() + INTERVAL '30 days', true),
('DEMO-5678-IJKL-MNOP', 'الباقة الصغيرة', 100, NOW() + INTERVAL '7 days', true);

-- التحقق من البيانات المدرجة
SELECT * FROM public.licenses WHERE license_key IN ('E6Q6-SENO-KHVO-OTOC', 'TEST-1234-ABCD-EFGH', 'DEMO-5678-IJKL-MNOP');
