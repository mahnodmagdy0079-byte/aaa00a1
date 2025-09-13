-- Create secure function to get user license info
CREATE OR REPLACE FUNCTION get_user_license_info()
RETURNS TABLE (
  license_key text,
  package_name text,
  end_date timestamp with time zone,
  days_remaining integer
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.license_key,
    l.package_name,
    l.end_date,
    CASE 
      WHEN l.end_date > NOW() THEN EXTRACT(DAY FROM l.end_date - NOW())::integer
      ELSE 0
    END as days_remaining
  FROM licenses l
  JOIN users u ON u.email = l.user_name
  WHERE u.id = auth.uid()
  AND l.end_date > NOW()
  ORDER BY l.end_date DESC
  LIMIT 1;
END;
$$;

-- Create secure function to check if user has active license
CREATE OR REPLACE FUNCTION user_has_active_license()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  has_license boolean := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM licenses l
    JOIN users u ON u.email = l.user_name
    WHERE u.id = auth.uid()
    AND l.end_date > NOW()
  ) INTO has_license;
  
  RETURN has_license;
END;
$$;

-- Create secure function to get user pending purchase requests
CREATE OR REPLACE FUNCTION get_user_pending_purchase()
RETURNS TABLE (
  id uuid,
  package_name text,
  package_price text,
  created_at timestamp with time zone,
  status text
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pr.id,
    pr.package_name,
    pr.package_price,
    pr.created_at,
    pr.status
  FROM purchase_requests pr
  WHERE pr.user_email = auth.email()
  AND pr.status = 'pending'
  ORDER BY pr.created_at DESC
  LIMIT 1;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_license_info() TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_active_license() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_pending_purchase() TO authenticated;
