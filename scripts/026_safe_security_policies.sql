-- إصلاح آمن لسياسات الأمان
-- Safe security policies fix

-- حذف جميع السياسات الموجودة أولاً
-- Drop all existing policies first

-- حذف سياسات tool_requests
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tool_requests' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS "Allow read access to tool_requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Allow insert access to tool_requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Allow update access to tool_requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Allow delete access to tool_requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Users can read own tool requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Users can insert own tool requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Users can update own tool requests" ON public.tool_requests;
        DROP POLICY IF EXISTS "Users can delete own tool requests" ON public.tool_requests;
    END IF;
END $$;

-- حذف سياسات phone_listings
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'phone_listings' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS "Allow read access to phone_listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Allow insert access to phone_listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Allow update access to phone_listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Allow delete access to phone_listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Users can read all phone listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Users can insert own phone listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Users can update own phone listings" ON public.phone_listings;
        DROP POLICY IF EXISTS "Users can delete own phone listings" ON public.phone_listings;
    END IF;
END $$;

-- حذف سياسات user_wallets
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_wallets' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS "Allow read access to user_wallets" ON public.user_wallets;
        DROP POLICY IF EXISTS "Allow insert access to user_wallets" ON public.user_wallets;
        DROP POLICY IF EXISTS "Allow update access to user_wallets" ON public.user_wallets;
        DROP POLICY IF EXISTS "Allow delete access to user_wallets" ON public.user_wallets;
        DROP POLICY IF EXISTS "Users can read own wallet" ON public.user_wallets;
        DROP POLICY IF EXISTS "Users can insert own wallet" ON public.user_wallets;
        DROP POLICY IF EXISTS "Users can update own wallet" ON public.user_wallets;
    END IF;
END $$;

-- حذف سياسات licenses
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'licenses' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS "Allow read access to licenses" ON public.licenses;
        DROP POLICY IF EXISTS "Allow insert access to licenses" ON public.licenses;
        DROP POLICY IF EXISTS "Allow update access to licenses" ON public.licenses;
        DROP POLICY IF EXISTS "Allow delete access to licenses" ON public.licenses;
        DROP POLICY IF EXISTS "Users can read own licenses" ON public.licenses;
        DROP POLICY IF EXISTS "Admin can manage licenses" ON public.licenses;
    END IF;
END $$;

-- إنشاء سياسات آمنة جديدة
-- Create new secure policies

-- سياسات tool_requests
CREATE POLICY "Users can read own tool requests" ON public.tool_requests 
FOR SELECT 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

CREATE POLICY "Users can insert own tool requests" ON public.tool_requests 
FOR INSERT 
WITH CHECK (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

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

CREATE POLICY "Users can delete own tool requests" ON public.tool_requests 
FOR DELETE 
USING (
  user_email = auth.jwt() ->> 'user_email' OR
  user_name = auth.jwt() ->> 'full_name'
);

-- سياسات phone_listings
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

-- سياسات user_wallets
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

-- سياسات licenses
CREATE POLICY "Users can read own licenses" ON public.licenses 
FOR SELECT 
USING (
  user_email = auth.jwt() ->> 'user_email'
);

-- فقط الأدمن يمكنه إدارة التراخيص
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
