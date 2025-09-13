-- Create tool_requests table for tracking individual tool purchases
CREATE TABLE IF NOT EXISTS tool_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    tool_price DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER NOT NULL,
    requires_credit BOOLEAN DEFAULT true,
    
    -- Tool activation details
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'failed')),
    actual_account TEXT, -- The actual account that succeeded from external program
    activation_start TIMESTAMPTZ,
    activation_end TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key reference
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tool_requests_user_email ON tool_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_tool_requests_status ON tool_requests(status);
CREATE INDEX IF NOT EXISTS idx_tool_requests_activation_end ON tool_requests(activation_end);

-- Enable RLS
ALTER TABLE tool_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own tool requests" ON tool_requests
    FOR SELECT USING (auth.email() = user_email);

CREATE POLICY "Users can insert their own tool requests" ON tool_requests
    FOR INSERT WITH CHECK (auth.email() = user_email);

CREATE POLICY "Service role can manage all tool requests" ON tool_requests
    FOR ALL USING (auth.role() = 'service_role');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tool_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tool_requests_updated_at_trigger ON tool_requests;
CREATE TRIGGER update_tool_requests_updated_at_trigger
    BEFORE UPDATE ON tool_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_tool_requests_updated_at();

-- Function to check and expire tool requests
CREATE OR REPLACE FUNCTION expire_tool_requests()
RETURNS void AS $$
BEGIN
    UPDATE tool_requests 
    SET status = 'expired'
    WHERE status = 'active' 
    AND activation_end < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to purchase tool with credit deduction
CREATE OR REPLACE FUNCTION purchase_tool_with_credits(
    p_user_email TEXT,
    p_tool_name TEXT,
    p_tool_price DECIMAL,
    p_duration_hours INTEGER,
    p_requires_credit BOOLEAN DEFAULT true
)
RETURNS JSON AS $$
DECLARE
    v_wallet_balance DECIMAL;
    v_request_id UUID;
    v_result JSON;
BEGIN
    -- Check user's wallet balance
    SELECT balance INTO v_wallet_balance
    FROM user_wallets
    WHERE user_email = p_user_email;
    
    -- If wallet doesn't exist, create it with 0 balance
    IF v_wallet_balance IS NULL THEN
        INSERT INTO user_wallets (user_email, balance)
        VALUES (p_user_email, 0)
        ON CONFLICT (user_email) DO NOTHING;
        v_wallet_balance := 0;
    END IF;
    
    -- Check if user has sufficient balance
    IF v_wallet_balance < p_tool_price THEN
        RETURN json_build_object(
            'success', false,
            'error', 'insufficient_balance',
            'message', 'رصيد غير كافي لشراء هذه الأداة',
            'required', p_tool_price,
            'available', v_wallet_balance
        );
    END IF;
    
    -- Deduct amount from wallet
    UPDATE user_wallets 
    SET balance = balance - p_tool_price,
        updated_at = NOW()
    WHERE user_email = p_user_email;
    
    -- Create tool request
    INSERT INTO tool_requests (
        user_email, 
        tool_name, 
        tool_price, 
        duration_hours, 
        requires_credit,
        status
    ) VALUES (
        p_user_email, 
        p_tool_name, 
        p_tool_price, 
        p_duration_hours, 
        p_requires_credit,
        'pending'
    ) RETURNING id INTO v_request_id;
    
    -- Record transaction
    INSERT INTO wallet_transactions (
        user_email,
        amount,
        transaction_type,
        description,
        admin_email
    ) VALUES (
        p_user_email,
        -p_tool_price,
        'debit',
        'شراء أداة: ' || p_tool_name,
        'system@auto'
    );
    
    RETURN json_build_object(
        'success', true,
        'request_id', v_request_id,
        'message', 'تم شراء الأداة بنجاح، في انتظار التفعيل',
        'remaining_balance', v_wallet_balance - p_tool_price
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', 'database_error',
        'message', 'حدث خطأ أثناء معالجة الطلب'
    );
END;
$$ LANGUAGE plpgsql;
