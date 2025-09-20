-- Create device_secret_keys table for managing device-specific secret keys
CREATE TABLE IF NOT EXISTS device_secret_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_id TEXT NOT NULL UNIQUE,
    secret_key TEXT NOT NULL,
    app_version TEXT DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_by TEXT DEFAULT 'system',
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_device_secret_keys_device_id ON device_secret_keys(device_id);
CREATE INDEX IF NOT EXISTS idx_device_secret_keys_expires_at ON device_secret_keys(expires_at);
CREATE INDEX IF NOT EXISTS idx_device_secret_keys_is_active ON device_secret_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_device_secret_keys_last_used ON device_secret_keys(last_used);

-- Enable RLS on the table
ALTER TABLE device_secret_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for device_secret_keys
CREATE POLICY "Allow service role full access to device_secret_keys" ON device_secret_keys
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to clean up expired keys
CREATE OR REPLACE FUNCTION cleanup_expired_device_keys()
RETURNS void AS $$
BEGIN
    -- Delete expired keys
    DELETE FROM device_secret_keys 
    WHERE expires_at < NOW() AND is_active = true;
    
    -- Log cleanup action
    INSERT INTO device_secret_keys (device_id, secret_key, notes, is_active)
    VALUES ('cleanup_log', 'cleanup_' || NOW()::text, 'Expired keys cleaned up', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get active device key
CREATE OR REPLACE FUNCTION get_device_secret_key(p_device_id TEXT)
RETURNS TABLE (
    secret_key TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dsk.secret_key,
        dsk.expires_at,
        dsk.is_active
    FROM device_secret_keys dsk
    WHERE dsk.device_id = p_device_id 
    AND dsk.is_active = true
    AND dsk.expires_at > NOW()
    ORDER BY dsk.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to revoke device key
CREATE OR REPLACE FUNCTION revoke_device_key(p_device_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE device_secret_keys 
    SET is_active = false, 
        last_used = NOW(),
        notes = COALESCE(notes, '') || ' - Revoked at ' || NOW()::text
    WHERE device_id = p_device_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to extend device key expiry
CREATE OR REPLACE FUNCTION extend_device_key(p_device_id TEXT, p_days INTEGER DEFAULT 30)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE device_secret_keys 
    SET expires_at = NOW() + (p_days || ' days')::INTERVAL,
        last_used = NOW(),
        notes = COALESCE(notes, '') || ' - Extended by ' || p_days || ' days at ' || NOW()::text
    WHERE device_id = p_device_id AND is_active = true;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get device key statistics
CREATE OR REPLACE FUNCTION get_device_key_stats()
RETURNS TABLE (
    total_keys BIGINT,
    active_keys BIGINT,
    expired_keys BIGINT,
    keys_expiring_soon BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_keys,
        COUNT(*) FILTER (WHERE is_active = true AND expires_at > NOW()) as active_keys,
        COUNT(*) FILTER (WHERE expires_at <= NOW()) as expired_keys,
        COUNT(*) FILTER (WHERE is_active = true AND expires_at > NOW() AND expires_at <= NOW() + INTERVAL '7 days') as keys_expiring_soon
    FROM device_secret_keys;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample data for testing (optional)
-- INSERT INTO device_secret_keys (device_id, secret_key, expires_at, notes)
-- VALUES 
--     ('test_device_1', 'sample_key_1', NOW() + INTERVAL '30 days', 'Test device 1'),
--     ('test_device_2', 'sample_key_2', NOW() + INTERVAL '30 days', 'Test device 2');

-- Create a view for active device keys (for admin monitoring)
CREATE OR REPLACE VIEW active_device_keys AS
SELECT 
    device_id,
    app_version,
    created_at,
    expires_at,
    last_used,
    CASE 
        WHEN expires_at <= NOW() THEN 'EXPIRED'
        WHEN expires_at <= NOW() + INTERVAL '7 days' THEN 'EXPIRING_SOON'
        ELSE 'ACTIVE'
    END as status,
    notes
FROM device_secret_keys
WHERE is_active = true
ORDER BY created_at DESC;

-- Grant permissions
GRANT SELECT ON active_device_keys TO anon;
GRANT SELECT ON active_device_keys TO authenticated;
