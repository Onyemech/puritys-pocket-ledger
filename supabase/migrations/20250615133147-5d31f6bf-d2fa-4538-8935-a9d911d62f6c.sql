
-- Enable RLS if not already enabled
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- POLICY: Allow any authenticated user to insert payments
CREATE POLICY "Authenticated users can insert payments"
  ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');
