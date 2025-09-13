-- Adding missing requires_credit column and fixing constraints
-- Add missing requires_credit column to tools table
ALTER TABLE tools ADD COLUMN IF NOT EXISTS requires_credit BOOLEAN DEFAULT true;

-- Fix tool_requests table to allow null user_name (since we use user_email)
ALTER TABLE tool_requests ALTER COLUMN user_name DROP NOT NULL;

-- Update existing tools to have requires_credit value
UPDATE tools SET requires_credit = true WHERE requires_credit IS NULL;

-- Add some default tools if table is empty
INSERT INTO tools (name, image_url, price, duration_hours, requires_credit) 
VALUES 
  ('UNLOCK TOOL', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unlocktool-NPHtho1CAQGcQHKCNF6xxWGzTPvRkS.png', 40, 6, true),
  ('AMT', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amt%20tool-vbZwFqmow6hmLB9T8NycS6F1L9aT3T.png', 10, 6, false),
  ('TSM TOOL', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tsm-nuVd1KpatoAvPdDUZ6Jk9myjKO69P2.png', 70, 24, true),
  ('CF TOOL', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CF-Tool-logo-4fWDOa32L480YscXSWQ4PTGDTpmUWy.png', 70, 24, true),
  ('TFM TOOL', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TFM-TOOL-xOkieC4R23uDNcaBCD4ZThBl1iixQY.png', 50, 24, true),
  ('Cheetah TOOL', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah-TOOL-jXJ3EgPZTbIaG9YCbT0DhuBHxihU8f.png', 50, 24, true),
  ('Global Unlocker Pro', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/global-unlucker-pro-aVsW6X3q8Gdd3rXk7r1dNxsFCTTSZy.png', 10, 6, false)
ON CONFLICT (name) DO NOTHING;
