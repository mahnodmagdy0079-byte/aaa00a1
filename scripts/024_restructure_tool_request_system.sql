-- Restructure the tool request system for better user, wallet, and tool relationships
-- This addresses the user's requirements for proper status tracking and financial integration

-- First, let's add the missing status column and update the tool_requests table structure
ALTER TABLE tool_requests 
ADD COLUMN IF NOT EXISTS status_ar TEXT DEFAULT 'قيد التشغيل',
ADD COLUMN IF NOT EXISTS shared_email TEXT, -- For the Windows program to fill
ADD COLUMN IF NOT EXISTS is_subscription_based BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS wallet_transaction_id UUID REFERENCES wallet_transactions(id);

-- Update the status column to use Arabic statuses
UPDATE tool_requests SET status_ar = 'قيد التشغيل' WHERE status = 'active' OR status = 'pending';
UPDATE tool_requests SET status_ar = 'Done' WHERE status = 'completed' OR status = 'expired';

-- Create an index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_tool_requests_status_ar ON tool_requests(status_ar);
CREATE INDEX IF NOT EXISTS idx_tool_requests_user_email ON tool_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_tool_requests_end_time ON tool_requests(end_time);

-- Create a function to automatically update expired tool requests
CREATE OR REPLACE FUNCTION update_expired_tool_requests()
RETURNS void AS $$
BEGIN
    UPDATE tool_requests 
    SET status_ar = 'Done'
    WHERE end_time < NOW() 
    AND status_ar = 'قيد التشغيل';
END;
$$ LANGUAGE plpgsql;

-- Create a function to handle tool request creation with proper financial logic
CREATE OR REPLACE FUNCTION create_tool_request(
    p_user_email TEXT,
    p_tool_name TEXT,
    p_duration_hours INTEGER,
    p_price NUMERIC,
    p_is_subscription_based BOOLEAN DEFAULT FALSE
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_user_name TEXT;
    v_wallet_balance NUMERIC;
    v_request_id UUID;
    v_transaction_id UUID;
    v_start_time TIMESTAMP WITH TIME ZONE;
    v_end_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get user information
    SELECT id, full_name INTO v_user_id, v_user_name
    FROM users WHERE email = p_user_email;
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Set start and end times
    v_start_time := NOW();
    v_end_time := v_start_time + (p_duration_hours || ' hours')::INTERVAL;
    
    -- If not subscription-based, check wallet balance and deduct amount
    IF NOT p_is_subscription_based THEN
        -- Get current wallet balance
        SELECT balance INTO v_wallet_balance
        FROM user_wallets WHERE user_email = p_user_email;
        
        IF v_wallet_balance IS NULL OR v_wallet_balance < p_price THEN
            RETURN json_build_object('success', false, 'error', 'Insufficient wallet balance');
        END IF;
        
        -- Deduct amount from wallet
        UPDATE user_wallets 
        SET balance = balance - p_price,
            updated_at = NOW()
        WHERE user_email = p_user_email;
        
        -- Create wallet transaction record
        INSERT INTO wallet_transactions (
            user_email, user_id, amount, transaction_type, description, created_at
        ) VALUES (
            p_user_email, v_user_id, -p_price, 'debit', 
            'Tool purchase: ' || p_tool_name, NOW()
        ) RETURNING id INTO v_transaction_id;
    END IF;
    
    -- Create tool request
    INSERT INTO tool_requests (
        id, user_email, user_id, user_name, tool_name,
        start_time, end_time, duration_hours, price,
        status_ar, is_subscription_based, wallet_transaction_id,
        purchase_type, created_at, requested_at, ultra_id
    ) VALUES (
        gen_random_uuid(), p_user_email, v_user_id, v_user_name, p_tool_name,
        v_start_time, v_end_time, p_duration_hours, p_price,
        'قيد التشغيل', p_is_subscription_based, v_transaction_id,
        CASE WHEN p_is_subscription_based THEN 'subscription' ELSE 'credit' END,
        NOW(), NOW(), ''
    ) RETURNING id INTO v_request_id;
    
    RETURN json_build_object(
        'success', true, 
        'request_id', v_request_id,
        'start_time', v_start_time,
        'end_time', v_end_time,
        'transaction_id', v_transaction_id
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to update shared email (for Windows program)
CREATE OR REPLACE FUNCTION update_shared_email(
    p_request_id UUID,
    p_shared_email TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE tool_requests 
    SET shared_email = p_shared_email,
        updated_at = NOW()
    WHERE id = p_request_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for tool_requests
ALTER TABLE tool_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own requests
CREATE POLICY "Users can view their own tool requests" ON tool_requests
    FOR SELECT USING (auth.email() = user_email);

-- Policy for service role to manage all requests
CREATE POLICY "Service role can manage all tool requests" ON tool_requests
    FOR ALL USING (auth.role() = 'service_role');

-- Create a view for active tool requests with remaining time
CREATE OR REPLACE VIEW active_tool_requests AS
SELECT 
    tr.*,
    CASE 
        WHEN tr.end_time > NOW() THEN 
            EXTRACT(EPOCH FROM (tr.end_time - NOW()))::INTEGER
        ELSE 0 
    END as remaining_seconds,
    CASE 
        WHEN tr.end_time > NOW() THEN tr.status_ar
        ELSE 'Done'
    END as current_status
FROM tool_requests tr
WHERE tr.status_ar = 'قيد التشغيل' OR tr.end_time > NOW() - INTERVAL '1 day';

-- Grant necessary permissions
GRANT SELECT ON active_tool_requests TO authenticated;
GRANT SELECT ON active_tool_requests TO service_role;
