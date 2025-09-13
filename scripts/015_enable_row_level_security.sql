-- Enable Row Level Security on all tables
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only see their own licenses" ON licenses;
DROP POLICY IF EXISTS "Users can only see their own purchase requests" ON purchase_requests;
DROP POLICY IF EXISTS "Users can only see their own tool requests" ON tool_requests;
DROP POLICY IF EXISTS "Users can only see their own password change requests" ON password_change_requests;
DROP POLICY IF EXISTS "Users can only see their own phone listings" ON phone_listings;
DROP POLICY IF EXISTS "Users can only see their own profile" ON users;

-- Create RLS policies for licenses table
CREATE POLICY "Users can only see their own licenses" 
ON licenses FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.email = licenses.user_name
  )
);

-- Create RLS policies for purchase_requests table
CREATE POLICY "Users can only see their own purchase requests" 
ON purchase_requests FOR ALL 
USING (user_email = auth.email());

-- Create RLS policies for tool_requests table
CREATE POLICY "Users can only see their own tool requests" 
ON tool_requests FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.email = tool_requests.user_name
  )
);

-- Create RLS policies for password_change_requests table
CREATE POLICY "Users can only see their own password change requests" 
ON password_change_requests FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.email = password_change_requests.user_name
  )
);

-- Create RLS policies for phone_listings table
CREATE POLICY "Users can only see their own phone listings" 
ON phone_listings FOR ALL 
USING (user_id = auth.uid());

-- Create RLS policies for users table
CREATE POLICY "Users can only see their own profile" 
ON users FOR ALL 
USING (id = auth.uid());

-- Admin policies - allow service role to access everything
CREATE POLICY "Service role can access all licenses" 
ON licenses FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Service role can access all purchase requests" 
ON purchase_requests FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Service role can access all tool requests" 
ON tool_requests FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Service role can access all password change requests" 
ON password_change_requests FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Service role can access all phone listings" 
ON phone_listings FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Service role can access all users" 
ON users FOR ALL 
TO service_role 
USING (true);

-- Keep tool accounts and unlock accounts accessible for admin operations
-- These don't contain user-specific data that needs RLS
