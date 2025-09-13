-- Create tools table with pricing and duration information
CREATE TABLE IF NOT EXISTS tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price NUMERIC NOT NULL,
    duration_hours INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the tools with their pricing and duration
INSERT INTO tools (name, price, duration_hours, description, image_url) VALUES
('UNLOCK TOOL', 40, 6, 'أداة فتح الأجهزة المتقدمة', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlocktool-NPHtho1CAQGcQHKCNF6xxWGzTPvRkS.png'),
('AMT', 10, 6, 'أداة AMT للصيانة المتقدمة', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amt%20tool-vbZwFqmow6hmLB9T8NycS6F1L9aT3T.png'),
('TSM TOOL', 70, 24, 'أداة TSM للخدمات التقنية', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tsm-nuVd1KpatoAvPdDUZ6Jk9myjKO69P2.png'),
('CF TOOL', 70, 24, 'أداة CF للحلول التقنية', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CF-Tool-logo-4fWDOa32L480YscXSWQ4PTGDTpmUWy.png'),
('TFM TOOL', 50, 24, 'أداة TFM المتطورة', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TFM-TOOL-xOkieC4R23uDNcaBCD4ZThBl1iixQY.png'),
('Cheetah TOOL', 50, 24, 'أداة Cheetah السريعة', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah-TOOL-jXJ3EgPZTbIaG9YCbT0DhuBHxihU8f.png'),
('Global Unlocker Pro', 10, 6, 'أداة فتح الأجهزة العالمية', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/global-unlucker-pro-aVsW6X3q8Gdd3rXk7r1dNxsFCTTSZy.png')
ON CONFLICT (name) DO UPDATE SET
    price = EXCLUDED.price,
    duration_hours = EXCLUDED.duration_hours,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    updated_at = NOW();

-- Add missing columns to tool_requests table
ALTER TABLE tool_requests 
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS duration_hours INTEGER,
ADD COLUMN IF NOT EXISTS purchase_type TEXT DEFAULT 'individual'; -- 'individual' or 'subscription'

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tool_requests_user_email ON tool_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_tool_requests_end_time ON tool_requests(end_time);
CREATE INDEX IF NOT EXISTS idx_tool_requests_status ON tool_requests(status);

-- Update existing tool_requests to have proper status values
UPDATE tool_requests SET status = 'pending' WHERE status IS NULL OR status = '';

-- Create function to automatically set end_time when start_time is set
CREATE OR REPLACE FUNCTION set_tool_request_end_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_time IS NOT NULL AND NEW.duration_hours IS NOT NULL THEN
        NEW.end_time = NEW.start_time + (NEW.duration_hours || ' hours')::INTERVAL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate end_time
DROP TRIGGER IF EXISTS trigger_set_tool_request_end_time ON tool_requests;
CREATE TRIGGER trigger_set_tool_request_end_time
    BEFORE INSERT OR UPDATE ON tool_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_tool_request_end_time();

-- Enable RLS on tools table
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Create policies for tools table
CREATE POLICY "Allow public read access to tools" ON tools
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access to tools" ON tools
    USING (auth.role() = 'service_role');
