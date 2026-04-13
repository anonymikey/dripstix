
-- Remove duplicate trigger
DROP TRIGGER IF EXISTS trg_apply_affiliate ON public.orders;

-- Create affiliate payouts table
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_code_id UUID NOT NULL REFERENCES public.affiliate_codes(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Admins can manage payouts
CREATE POLICY "Admins manage payouts"
ON public.affiliate_payouts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read payouts (needed for affiliate portal lookup)
CREATE POLICY "Anyone can read payouts"
ON public.affiliate_payouts
FOR SELECT
TO anon, authenticated
USING (true);
