-- Create unlock_accounts table for storing UNLOCK TOOL account credentials
CREATE TABLE IF NOT EXISTS unlock_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  tool_name TEXT DEFAULT 'UNLOCK TOOL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert some test unlock accounts
INSERT INTO unlock_accounts (username, password, is_available, tool_name) VALUES
('testuser1', 'testpass1', true, 'UNLOCK TOOL'),
('testuser2', 'testpass2', true, 'UNLOCK TOOL'),
('testuser3', 'testpass3', true, 'UNLOCK TOOL');

-- Enable RLS
ALTER TABLE unlock_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (service role can access all)
CREATE POLICY "Service role can manage unlock accounts" ON unlock_accounts
FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users to read available accounts only
CREATE POLICY "Users can read available unlock accounts" ON unlock_accounts
FOR SELECT USING (is_available = true AND auth.role() = 'authenticated');
