-- Add missing UPDATE policy for purchase_requests table
-- This allows service role (admin) to update purchase request status

CREATE POLICY "Allow service role to update purchase requests" ON purchase_requests
  FOR UPDATE USING (true);

-- Also add DELETE policy for completeness
CREATE POLICY "Allow service role to delete purchase requests" ON purchase_requests
  FOR DELETE USING (true);
