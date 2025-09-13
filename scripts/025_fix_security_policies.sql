-- إصلاح سياسات الأمان الخطيرة
-- Fix dangerous security policies

-- حذف السياسات الخطيرة الموجودة
-- Drop existing dangerous policies
DROP POLICY IF EXISTS "Allow read access to tool_requests" ON public.tool_requests;
DROP POLICY IF EXISTS "Allow insert access to tool_requests" ON public.tool_requests;
DROP POLICY IF EXISTS "Allow update access to tool_requests" ON public.tool_requests;
DROP POLICY IF EXISTS "Allow delete access to tool_requests" ON public.tool_requests;

-- إنشاء سياسات أمان صحيحة
-- Create proper security policies

-- سياسة للقراءة - المستخدمون يمكنهم قراءة طلباتهم فقط
-- Read policy - users can only read their own requests
CREATE POLICY "Users can read own tool requests" ON public.tool_requests 
FOR SELECT 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

-- سياسة للإدراج - المستخدمون يمكنهم إدراج طلباتهم فقط
-- Insert policy - users can only insert their own requests
CREATE POLICY "Users can insert own tool requests" ON public.tool_requests 
FOR INSERT 
WITH CHECK (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

-- سياسة للتحديث - المستخدمون يمكنهم تحديث طلباتهم فقط
-- Update policy - users can only update their own requests
CREATE POLICY "Users can update own tool requests" ON public.tool_requests 
FOR UPDATE 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
)
WITH CHECK (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

-- سياسة للحذف - المستخدمون يمكنهم حذف طلباتهم فقط
-- Delete policy - users can only delete their own requests
CREATE POLICY "Users can delete own tool requests" ON public.tool_requests 
FOR DELETE 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

-- إصلاح سياسات جدول الهواتف المعروضة
-- Fix phone listings table policies
DROP POLICY IF EXISTS "Allow read access to phone_listings" ON public.phone_listings;
DROP POLICY IF EXISTS "Allow insert access to phone_listings" ON public.phone_listings;
DROP POLICY IF EXISTS "Allow update access to phone_listings" ON public.phone_listings;
DROP POLICY IF EXISTS "Allow delete access to phone_listings" ON public.phone_listings;

-- سياسات آمنة لجدول الهواتف
-- Secure policies for phone listings
CREATE POLICY "Users can read all phone listings" ON public.phone_listings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert own phone listings" ON public.phone_listings 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() OR
  user_name = auth.jwt() ->> 'full_name'
);

CREATE POLICY "Users can update own phone listings" ON public.phone_listings 
FOR UPDATE 
USING (
  user_id = auth.uid() OR
  user_name = auth.jwt() ->> 'full_name'
)
WITH CHECK (
  user_id = auth.uid() OR
  user_name = auth.jwt() ->> 'full_name'
);

CREATE POLICY "Users can delete own phone listings" ON public.phone_listings 
FOR DELETE 
USING (
  user_id = auth.uid() OR
  user_name = auth.jwt() ->> 'full_name'
);

-- إصلاح سياسات جدول المحافظ
-- Fix user wallets table policies
DROP POLICY IF EXISTS "Allow read access to user_wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Allow insert access to user_wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Allow update access to user_wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Allow delete access to user_wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can read own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can insert own wallet" ON public.user_wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.user_wallets;

-- سياسات آمنة لجدول المحافظ
-- Secure policies for user wallets
CREATE POLICY "Users can read own wallet" ON public.user_wallets 
FOR SELECT 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_id = auth.uid()
);

CREATE POLICY "Users can insert own wallet" ON public.user_wallets 
FOR INSERT 
WITH CHECK (
  user_email = auth.jwt() ->> 'user_email' OR
  user_id = auth.uid()
);

CREATE POLICY "Users can update own wallet" ON public.user_wallets 
FOR UPDATE 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_id = auth.uid()
)
WITH CHECK (
  user_email = auth.jwt() ->> 'user_email' OR
  user_id = auth.uid()
);

-- إصلاح سياسات جدول التراخيص
-- Fix licenses table policies
DROP POLICY IF EXISTS "Allow read access to licenses" ON public.licenses;
DROP POLICY IF EXISTS "Allow insert access to licenses" ON public.licenses;
DROP POLICY IF EXISTS "Allow update access to licenses" ON public.licenses;
DROP POLICY IF EXISTS "Allow delete access to licenses" ON public.licenses;
DROP POLICY IF EXISTS "Users can read own licenses" ON public.licenses;
DROP POLICY IF EXISTS "Admin can manage licenses" ON public.licenses;

-- سياسات آمنة لجدول التراخيص
-- Secure policies for licenses
CREATE POLICY "Users can read own licenses" ON public.licenses 
FOR SELECT 
USING (
  user_email = auth.jwt() ->> 'user_email'
);

-- فقط الأدمن يمكنه إدراج/تحديث/حذف التراخيص
-- Only admin can insert/update/delete licenses
CREATE POLICY "Admin can manage licenses" ON public.licenses 
FOR ALL 
USING (
  auth.jwt() ->> 'user_email' = 'admin@tooly.com'
)
WITH CHECK (
  auth.jwt() ->> 'user_email' = 'admin@tooly.com'
);

-- إضافة تعليق
COMMENT ON TABLE public.tool_requests IS 'جدول طلبات الأدوات - محمي بسياسات أمان صحيحة';
