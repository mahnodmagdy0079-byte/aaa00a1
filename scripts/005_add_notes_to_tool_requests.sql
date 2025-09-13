-- إضافة حقل الملاحظات لجدول طلبات الأدوات
ALTER TABLE tool_requests 
ADD COLUMN notes TEXT DEFAULT '';

-- إضافة فهرس للبحث في الملاحظات
CREATE INDEX IF NOT EXISTS idx_tool_requests_notes ON tool_requests(notes);

-- تحديث الملاحظات للطلبات الموجودة (اختياري)
UPDATE tool_requests 
SET notes = '' 
WHERE notes IS NULL;
