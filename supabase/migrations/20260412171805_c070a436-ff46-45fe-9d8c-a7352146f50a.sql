
-- Add total_earnings column to affiliate_codes
ALTER TABLE public.affiliate_codes
ADD COLUMN total_earnings numeric NOT NULL DEFAULT 0;

-- Update the trigger function to also track affiliate commission
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
  v_commission NUMERIC;
BEGIN
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
  
  -- Calculate 20% commission on original order total (before discount)
  v_commission := round((COALESCE(NEW.total, 0) * 0.20)::numeric, 2);
  
  NEW.total := GREATEST(COALESCE(NEW.total, 0) - NEW.affiliate_discount, 0);

  UPDATE public.affiliate_codes
  SET usage_count = usage_count + 1,
      total_earnings = total_earnings + v_commission
  WHERE code = v_code;

  RETURN NEW;
END;
$function$;
