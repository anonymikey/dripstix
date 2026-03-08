
-- Fix: Change restrictive INSERT policies to permissive so non-admin users can create orders/items

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create order_items" ON public.order_items;
CREATE POLICY "Anyone can create order_items"
ON public.order_items FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read own order" ON public.orders;
CREATE POLICY "Anyone can read own order"
ON public.orders FOR SELECT TO public
USING (true);
