
-- Add phone_number to affiliate_codes (the phone number this code is assigned to)
ALTER TABLE public.affiliate_codes ADD COLUMN IF NOT EXISTS phone_number text;

-- Update the trigger to match by phone_number instead of code
CREATE OR REPLACE FUNCTION public.apply_affiliate_to_order()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_discount_percent NUMERIC;
  v_code TEXT;
  v_discount_amount NUMERIC;
BEGIN
  -- Look up affiliate code by the customer's phone number
  SELECT code, discount_percent
  INTO v_code, v_discount_percent
  FROM public.affiliate_codes
  WHERE phone_number = NEW.phone_number
    AND is_active = true
  LIMIT 1;

  IF v_code IS NULL THEN
    NEW.affiliate_code := NULL;
    NEW.affiliate_discount := 0;
    RETURN NEW;
  END IF;

  NEW.affiliate_code := v_code;
  v_discount_amount := round((COALESCE(NEW.total, 0) * (v_discount_percent / 100.0))::numeric, 2);
  NEW.affiliate_discount := GREATEST(v_discount_amount, 0);
  NEW.total := GREATEST(COALESCE(NEW.total, 0) - NEW.affiliate_discount, 0);

  UPDATE public.affiliate_codes
  SET usage_count = usage_count + 1
  WHERE code = v_code;

  RETURN NEW;
END;
$function$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trg_apply_affiliate ON public.orders;
CREATE TRIGGER trg_apply_affiliate
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_affiliate_to_order();
