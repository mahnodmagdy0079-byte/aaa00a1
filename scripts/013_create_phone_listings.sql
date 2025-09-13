-- إنشاء جدول عرض الهواتف للإصلاح
CREATE TABLE IF NOT EXISTS phone_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  phone_model TEXT NOT NULL,
  problem_type TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE phone_listings ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة - الجميع يمكنهم رؤية الهواتف النشطة
CREATE POLICY "Anyone can view active phone listings" ON phone_listings
  FOR SELECT USING (status = 'active');

-- سياسة للإدراج - المستخدمون المصادق عليهم فقط
CREATE POLICY "Authenticated users can create phone listings" ON phone_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- سياسة للتحديث - المالك فقط
CREATE POLICY "Users can update their own phone listings" ON phone_listings
  FOR UPDATE USING (auth.uid() = user_id);

-- سياسة للحذف - المالك فقط
CREATE POLICY "Users can delete their own phone listings" ON phone_listings
  FOR DELETE USING (auth.uid() = user_id);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_phone_listings_status ON phone_listings(status);
CREATE INDEX IF NOT EXISTS idx_phone_listings_created_at ON phone_listings(created_at DESC);
