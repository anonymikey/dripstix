
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE

-- categories
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can read categories" ON public.categories;
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- products
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- orders
DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- order_items
DROP POLICY IF EXISTS "Admins manage order_items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order_items" ON public.order_items;
CREATE POLICY "Anyone can create order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage order_items" ON public.order_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- reviews
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
CREATE POLICY "Anyone can read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_content
DROP POLICY IF EXISTS "Admins manage site_content" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can read site_content" ON public.site_content;
CREATE POLICY "Anyone can read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage site_content" ON public.site_content FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- style_options
DROP POLICY IF EXISTS "Admins manage style_options" ON public.style_options;
DROP POLICY IF EXISTS "Anyone can read style_options" ON public.style_options;
CREATE POLICY "Anyone can read style_options" ON public.style_options FOR SELECT USING (true);
CREATE POLICY "Admins manage style_options" ON public.style_options FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Admins manage user_roles" ON public.user_roles;
CREATE POLICY "Admins manage user_roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add cascade delete for order_items when order is deleted
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
