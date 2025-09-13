-- إنشاء جدول طلبات تغيير كلمة المرور
CREATE TABLE IF NOT EXISTS password_change_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_request_id UUID REFERENCES tool_requests(id),
    user_name TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    ultra_id TEXT NOT NULL,
    license_key TEXT NOT NULL,
    old_password TEXT NOT NULL,
    new_password TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    reason TEXT DEFAULT 'كلمة المرور القديمة لا تعمل',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_password_change_requests_license_key ON password_change_requests(license_key);
CREATE INDEX IF NOT EXISTS idx_password_change_requests_status ON password_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_password_change_requests_created_at ON password_change_requests(created_at);

-- تفعيل Row Level Security
ALTER TABLE password_change_requests ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "Allow read access to password_change_requests" ON password_change_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert access to password_change_requests" ON password_change_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to password_change_requests" ON password_change_requests FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to password_change_requests" ON password_change_requests FOR DELETE USING (true);
