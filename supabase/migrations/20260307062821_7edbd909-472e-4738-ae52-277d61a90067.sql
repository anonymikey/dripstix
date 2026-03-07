-- Affiliate codes table for shareable discount links
CREATE TABLE IF NOT EXISTS public.affiliate_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percent NUMERIC NOT NULL DEFAULT 20,
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT affiliate_codes_discount_range CHECK (discount_percent >= 0 AND discount_percent <= 100)
);

CREATE INDEX IF NOT EXISTS idx_affiliate_codes_code ON public.affiliate_codes(code);
CREATE INDEX IF NOT EXISTS idx_affiliate_codes_active ON public.affiliate_codes(is_active);

ALTER TABLE public.affiliate_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active affiliate codes" ON public.affiliate_codes;
CREATE POLICY "Anyone can read active affiliate codes"
ON public.affiliate_codes
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can create affiliate codes" ON public.affiliate_codes;
CREATE POLICY "Anyone can create affiliate codes"
ON public.affiliate_codes
FOR INSERT
WITH CHECK (
  is_active = true
  AND discount_percent = 20
  AND char_length(code) >= 6
);

DROP POLICY IF EXISTS "Admins manage affiliate codes" ON public.affiliate_codes;
CREATE POLICY "Admins manage affiliate codes"
ON public.affiliate_codes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Store affiliate discount metadata on orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
ADD COLUMN IF NOT EXISTS affiliate_discount NUMERIC NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_affiliate_code ON public.orders(affiliate_code);

-- Server-side affiliate discount application and usage tracking
CREATE OR REPLACE FUNCTION public.apply_affiliate_to_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_discount_percent NUMERIC;
  v_discount_amount NUMERIC;
BEGIN
  IF NEW.affiliate_code IS NULL OR btrim(NEW.affiliate_code) = '' THEN
    NEW.affiliate_code := NULL;
    NEW.affiliate_discount := 0;
    RETURN NEW;
  END IF;

  SELECT discount_percent
  INTO v_discount_percent
  FROM public.affiliate_codes
  WHERE code = NEW.affiliate_code
    AND is_active = true
  LIMIT 1;

  IF v_discount_percent IS NULL THEN
    NEW.affiliate_code := NULL;
    NEW.affiliate_discount := 0;
    RETURN NEW;
  END IF;

  v_discount_amount := round((COALESCE(NEW.total, 0) * (v_discount_percent / 100.0))::numeric, 2);
  NEW.affiliate_discount := GREATEST(v_discount_amount, 0);
  NEW.total := GREATEST(COALESCE(NEW.total, 0) - NEW.affiliate_discount, 0);

  UPDATE public.affiliate_codes
  SET usage_count = usage_count + 1
  WHERE code = NEW.affiliate_code;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_affiliate_to_order ON public.orders;
CREATE TRIGGER trg_apply_affiliate_to_order
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.apply_affiliate_to_order();