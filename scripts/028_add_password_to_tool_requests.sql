-- Add password column to tool_requests table
-- This fixes the "null value in column password violates not-null constraint" error

-- Add password column if it doesn't exist
ALTER TABLE tool_requests 
ADD COLUMN IF NOT EXISTS password TEXT DEFAULT '';

-- Update existing records to have empty password if null
UPDATE tool_requests 
SET password = '' 
WHERE password IS NULL;

-- Make password column NOT NULL with default empty string
ALTER TABLE tool_requests 
ALTER COLUMN password SET NOT NULL,
ALTER COLUMN password SET DEFAULT '';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_tool_requests_password ON tool_requests(password);

-- Create a comment for documentation
COMMENT ON COLUMN tool_requests.password IS 'Password for the tool account (if applicable)';

-- Update the create_tool_request function to include password
CREATE OR REPLACE FUNCTION create_tool_request(
    p_user_email TEXT,
    p_tool_name TEXT,
    p_duration_hours INTEGER,
    p_price NUMERIC,
    p_is_subscription_based BOOLEAN DEFAULT FALSE,
    p_password TEXT DEFAULT ''
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
        purchase_type, created_at, requested_at, ultra_id, password
    ) VALUES (
        gen_random_uuid(), p_user_email, v_user_id, v_user_name, p_tool_name,
        v_start_time, v_end_time, p_duration_hours, p_price,
        'قيد التشغيل', p_is_subscription_based, v_transaction_id,
        CASE WHEN p_is_subscription_based THEN 'subscription' ELSE 'credit' END,
        NOW(), NOW(), '', p_password
    ) RETURNING id INTO v_request_id;
    
    RETURN json_build_object(
        'success', true, 
        'request_id', v_request_id,
        'start_time', v_start_time,
        'end_time', v_end_time,
        'transaction_id', v_transaction_id
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'حدث خطأ أثناء شراء الأداة');
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_tool_request TO authenticated;
GRANT EXECUTE ON FUNCTION create_tool_request TO service_role;
