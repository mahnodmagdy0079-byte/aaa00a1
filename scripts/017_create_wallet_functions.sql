-- Create function to add credit to user wallet
CREATE OR REPLACE FUNCTION add_wallet_credit(
  p_user_email TEXT,
  p_amount DECIMAL(10,2),
  p_description TEXT DEFAULT 'Credit addition',
  p_admin_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id
  FROM users
  WHERE email = p_user_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', p_user_email;
  END IF;
  
  -- Check if wallet exists, create if not
  SELECT id INTO v_wallet_id
  FROM user_wallets
  WHERE user_email = p_user_email;
  
  IF v_wallet_id IS NULL THEN
    -- Create new wallet
    INSERT INTO user_wallets (user_id, user_email, balance)
    VALUES (v_user_id, p_user_email, p_amount)
    RETURNING id INTO v_wallet_id;
  ELSE
    -- Update existing wallet balance
    UPDATE user_wallets
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE id = v_wallet_id;
  END IF;
  
  -- Add transaction record
  INSERT INTO wallet_transactions (
    wallet_id,
    user_email,
    amount,
    transaction_type,
    description,
    admin_email
  ) VALUES (
    v_wallet_id,
    p_user_email,
    p_amount,
    'credit',
    p_description,
    p_admin_email
  );
  
  RETURN TRUE;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error adding wallet credit: %', SQLERRM;
END;
$$;

-- Create function to deduct credit from user wallet
CREATE OR REPLACE FUNCTION deduct_wallet_credit(
  p_user_email TEXT,
  p_amount DECIMAL(10,2),
  p_description TEXT DEFAULT 'Credit deduction'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance DECIMAL(10,2);
BEGIN
  -- Get wallet info
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM user_wallets
  WHERE user_email = p_user_email;
  
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user: %', p_user_email;
  END IF;
  
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', v_current_balance, p_amount;
  END IF;
  
  -- Update wallet balance
  UPDATE user_wallets
  SET balance = balance - p_amount,
      updated_at = NOW()
  WHERE id = v_wallet_id;
  
  -- Add transaction record
  INSERT INTO wallet_transactions (
    wallet_id,
    user_email,
    amount,
    transaction_type,
    description
  ) VALUES (
    v_wallet_id,
    p_user_email,
    -p_amount,
    'debit',
    p_description
  );
  
  RETURN TRUE;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error deducting wallet credit: %', SQLERRM;
END;
$$;
