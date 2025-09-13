-- Fix RLS policies for users table to allow admin access
-- This ensures the service role can access the users table for admin operations

-- First, check if RLS is enabled on users table and disable it temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Allow service role full access" ON users;

-- Create policies that allow service role full access
CREATE POLICY "Allow service role full access" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Also ensure other tables have proper service role policies
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role full access" ON licenses;
CREATE POLICY "Allow service role full access" ON licenses
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role full access" ON user_wallets;
CREATE POLICY "Allow service role full access" ON user_wallets
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role full access" ON wallet_transactions;
CREATE POLICY "Allow service role full access" ON wallet_transactions
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role full access" ON purchase_requests;
CREATE POLICY "Allow service role full access" ON purchase_requests
  FOR ALL USING (auth.role() = 'service_role');
