-- إضافة حقل الحالة لجدول طلبات الأدوات
ALTER TABLE tool_requests 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending';

-- إنشاء فهرس للحالة لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_tool_requests_status ON tool_requests(status);

-- تحديث الطلبات الموجودة لتكون في حالة pending
UPDATE tool_requests 
SET status = 'pending' 
WHERE status IS NULL;

-- إضافة تعليق للحقل الجديد
COMMENT ON COLUMN tool_requests.status IS 'حالة الطلب: pending, processing, done';
