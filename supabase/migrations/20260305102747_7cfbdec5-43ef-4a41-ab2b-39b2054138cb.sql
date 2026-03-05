
-- 1. Validate order_items unit_price matches actual product price (considering sale_price)
CREATE OR REPLACE FUNCTION public.validate_order_item_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  actual_price numeric;
BEGIN
  IF NEW.product_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT CASE WHEN is_on_offer AND sale_price IS NOT NULL THEN sale_price ELSE base_price END
  INTO actual_price
  FROM public.products
  WHERE id = NEW.product_id;

  IF actual_price IS NULL THEN
    RAISE EXCEPTION 'Product not found: %', NEW.product_id;
  END IF;

  -- Override client-supplied price with server-verified price
  NEW.unit_price := actual_price;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_order_item_price
BEFORE INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_item_price();

-- 2. Recalculate order total from order_items after all items inserted
CREATE OR REPLACE FUNCTION public.recalculate_order_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  computed_total numeric;
BEGIN
  SELECT COALESCE(SUM(unit_price * quantity), 0)
  INTO computed_total
  FROM public.order_items
  WHERE order_id = NEW.order_id;

  UPDATE public.orders SET total = computed_total WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_recalculate_order_total
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_order_total();

-- 3. Add validation constraints on orders fields
ALTER TABLE public.orders
  ADD CONSTRAINT chk_phone_format CHECK (phone_number ~ '^[0-9+\s]{9,15}$'),
  ADD CONSTRAINT chk_customer_name_length CHECK (char_length(customer_name) <= 100),
  ADD CONSTRAINT chk_delivery_location_length CHECK (char_length(delivery_location) <= 255);
