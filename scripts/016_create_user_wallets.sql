-- Create user wallets table for credit system
CREATE TABLE IF NOT EXISTS user_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email)
);

-- Create wallet transactions table for tracking credit history
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES user_wallets(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'purchase', 'refund')),
    description TEXT,
    admin_email TEXT, -- Who performed the transaction (for admin actions)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_wallets
CREATE POLICY "Users can view their own wallet" ON user_wallets
    FOR SELECT USING (user_email = auth.email());

CREATE POLICY "Service role can manage all wallets" ON user_wallets
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view their own transactions" ON wallet_transactions
    FOR SELECT USING (user_email = auth.email());

CREATE POLICY "Service role can manage all transactions" ON wallet_transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Function to automatically create wallet when user is created
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_wallets (user_id, user_email, balance)
    VALUES (NEW.id, NEW.email, 0.00);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create wallet for new users
CREATE TRIGGER create_wallet_on_user_creation
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_wallet();

-- Function to update wallet balance and create transaction
CREATE OR REPLACE FUNCTION add_wallet_credit(
    p_user_email TEXT,
    p_amount DECIMAL(10,2),
    p_description TEXT DEFAULT 'Admin credit addition',
    p_admin_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    wallet_id_var UUID;
BEGIN
    -- Get or create wallet
    INSERT INTO user_wallets (user_email, balance)
    VALUES (p_user_email, 0.00)
    ON CONFLICT (user_email) DO NOTHING;
    
    -- Get wallet ID
    SELECT id INTO wallet_id_var FROM user_wallets WHERE user_email = p_user_email;
    
    -- Update balance
    UPDATE user_wallets 
    SET balance = balance + p_amount, updated_at = NOW()
    WHERE user_email = p_user_email;
    
    -- Create transaction record
    INSERT INTO wallet_transactions (wallet_id, user_email, amount, transaction_type, description, admin_email)
    VALUES (wallet_id_var, p_user_email, p_amount, 'credit', p_description, p_admin_email);
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
