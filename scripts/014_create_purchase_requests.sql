-- Create purchase_requests table for storing package purchase requests
CREATE TABLE IF NOT EXISTS purchase_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_price TEXT NOT NULL,
  package_period TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'جنيه',
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own purchase requests" ON purchase_requests
  FOR INSERT WITH CHECK (auth.email() = user_email);

CREATE POLICY "Users can view their own purchase requests" ON purchase_requests
  FOR SELECT USING (auth.email() = user_email);

CREATE POLICY "Allow all authenticated users to read purchase requests" ON purchase_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_purchase_requests_user_email ON purchase_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_created_at ON purchase_requests(created_at);

-- Insert some sample data for testing
INSERT INTO purchase_requests (user_email, package_name, package_price, package_period, phone_number, status) VALUES
('test@example.com', 'الباقة المتوسطة', '400', 'شهرياً', '01234567890', 'pending'),
('user@example.com', 'الباقة الصغيرة', '100', 'أسبوعياً', '01987654321', 'pending');
