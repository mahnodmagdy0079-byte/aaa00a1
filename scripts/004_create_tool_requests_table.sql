-- إنشاء جدول طلبات الأدوات
CREATE TABLE IF NOT EXISTS public.tool_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    ultra_id TEXT NOT NULL,
    password TEXT NOT NULL,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    license_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_tool_requests_license_key ON public.tool_requests(license_key);
CREATE INDEX IF NOT EXISTS idx_tool_requests_requested_at ON public.tool_requests(requested_at);
CREATE INDEX IF NOT EXISTS idx_tool_requests_user_name ON public.tool_requests(user_name);

-- إعداد Row Level Security
ALTER TABLE public.tool_requests ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة - يمكن للجميع قراءة البيانات
CREATE POLICY "Allow read access to tool_requests" ON public.tool_requests FOR SELECT USING (true);

-- سياسة للإدراج - يمكن للجميع إدراج البيانات
CREATE POLICY "Allow insert access to tool_requests" ON public.tool_requests FOR INSERT WITH CHECK (true);

-- سياسة للتحديث - يمكن للجميع تحديث البيانات
CREATE POLICY "Allow update access to tool_requests" ON public.tool_requests FOR UPDATE USING (true);

-- سياسة للحذف - يمكن للجميع حذف البيانات
CREATE POLICY "Allow delete access to tool_requests" ON public.tool_requests FOR DELETE USING (true);

-- إضافة تعليق على الجدول
COMMENT ON TABLE public.tool_requests IS 'جدول لحفظ طلبات الأدوات من المستخدمين';
