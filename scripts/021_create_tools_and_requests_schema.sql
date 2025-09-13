-- Create tools table with pricing and duration information
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tool_requests table to track user tool purchases
CREATE TABLE IF NOT EXISTS tool_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    user_name TEXT,
    tool_name TEXT NOT NULL,
    tool_id UUID REFERENCES tools(id),
    price_paid DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the tools with their pricing and duration
INSERT INTO tools (name, display_name, description, price, duration_hours, image_url) VALUES
('UNLOCK_TOOL', 'UNLOCK TOOL', 'أداة فتح الأجهزة المحمولة', 40.00, 6, '/placeholder.svg?height=80&width=80'),
('AMT', 'AMT Tool', 'أداة AMT للأندرويد', 10.00, 6, '/placeholder.svg?height=80&width=80'),
('TSM_TOOL', 'TSM TOOL', 'أداة TSM للخدمات التقنية', 70.00, 24, '/placeholder.svg?height=80&width=80'),
('CF_TOOL', 'CF TOOL', 'أداة CF للبرمجة', 70.00, 24, '/placeholder.svg?height=80&width=80'),
('TFM_TOOL', 'TFM TOOL', 'أداة TFM المتقدمة', 50.00, 24, '/placeholder.svg?height=80&width=80'),
('CHEETAH_TOOL', 'Cheetah TOOL', 'أداة Cheetah السريعة', 50.00, 24, '/placeholder.svg?height=80&width=80'),
('GLOBAL_UNLOCKER_PRO', 'Global Unlocker Pro', 'أداة Global Unlocker Pro', 10.00, 6, '/placeholder.svg?height=80&width=80');

-- Enable RLS on tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tools (public read access)
CREATE POLICY "Anyone can read tools" ON tools FOR SELECT USING (true);
CREATE POLICY "Service role can manage tools" ON tools FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for tool_requests
CREATE POLICY "Users can read their own tool requests" ON tool_requests 
    FOR SELECT USING (user_email = auth.email());
CREATE POLICY "Users can insert their own tool requests" ON tool_requests 
    FOR INSERT WITH CHECK (user_email = auth.email());
CREATE POLICY "Service role can manage all tool requests" ON tool_requests 
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update expired tool requests
CREATE OR REPLACE FUNCTION update_expired_tool_requests()
RETURNS void AS $$
BEGIN
    UPDATE tool_requests 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active' AND end_time < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get active tool requests for a user
CREATE OR REPLACE FUNCTION get_user_active_tools(p_user_email TEXT)
RETURNS TABLE (
    id UUID,
    tool_name TEXT,
    display_name TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT,
    price_paid DECIMAL,
    duration_hours INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tr.id,
        tr.tool_name,
        t.display_name,
        tr.start_time,
        tr.end_time,
        tr.status,
        tr.price_paid,
        tr.duration_hours
    FROM tool_requests tr
    LEFT JOIN tools t ON tr.tool_name = t.name
    WHERE tr.user_email = p_user_email 
    AND tr.status = 'active'
    AND tr.end_time > NOW()
    ORDER BY tr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to purchase a tool
CREATE OR REPLACE FUNCTION purchase_tool(
    p_user_email TEXT,
    p_tool_name TEXT,
    p_price DECIMAL,
    p_duration_hours INTEGER
)
RETURNS JSON AS $$
DECLARE
    v_wallet_balance DECIMAL;
    v_tool_id UUID;
    v_request_id UUID;
    v_end_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Check wallet balance
    SELECT balance INTO v_wallet_balance
    FROM user_wallets
    WHERE user_email = p_user_email;
    
    IF v_wallet_balance IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'المحفظة غير موجودة');
    END IF;
    
    IF v_wallet_balance < p_price THEN
        RETURN json_build_object('success', false, 'message', 'رصيد غير كافي في المحفظة');
    END IF;
    
    -- Get tool ID
    SELECT id INTO v_tool_id FROM tools WHERE name = p_tool_name;
    
    -- Calculate end time
    v_end_time := NOW() + (p_duration_hours || ' hours')::INTERVAL;
    
    -- Deduct from wallet
    UPDATE user_wallets 
    SET balance = balance - p_price, updated_at = NOW()
    WHERE user_email = p_user_email;
    
    -- Create tool request
    INSERT INTO tool_requests (user_email, tool_name, tool_id, price_paid, duration_hours, end_time)
    VALUES (p_user_email, p_tool_name, v_tool_id, p_price, p_duration_hours, v_end_time)
    RETURNING id INTO v_request_id;
    
    -- Record transaction
    INSERT INTO wallet_transactions (user_email, amount, transaction_type, description, admin_email)
    VALUES (p_user_email, -p_price, 'debit', 'شراء أداة: ' || p_tool_name, 'system');
    
    RETURN json_build_object(
        'success', true, 
        'message', 'تم شراء الأداة بنجاح',
        'request_id', v_request_id,
        'end_time', v_end_time
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', 'حدث خطأ أثناء شراء الأداة');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
