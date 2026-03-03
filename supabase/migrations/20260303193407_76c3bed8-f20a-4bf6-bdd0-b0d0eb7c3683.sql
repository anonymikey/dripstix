
-- Product type enum
CREATE TYPE public.product_type AS ENUM ('phone', 'laptop');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Categories table (composite unique on name+type)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📦',
  description TEXT NOT NULL DEFAULT '',
  product_type public.product_type NOT NULL DEFAULT 'phone',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, product_type)
);

CREATE TABLE public.style_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price_modifier NUMERIC NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  base_price NUMERIC NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  product_type public.product_type NOT NULL DEFAULT 'phone',
  image TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  style TEXT NOT NULL DEFAULT 'Matte',
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Security definer for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read style_options" ON public.style_options FOR SELECT USING (true);
CREATE POLICY "Anyone can read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read site_content" ON public.site_content FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage style_options" ON public.style_options FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage order_items" ON public.order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage site_content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage user_roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public order creation
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data
INSERT INTO public.categories (name, emoji, description, product_type, sort_order) VALUES
  ('Anime', '🎌', 'Your fave characters, dripped out', 'phone', 1),
  ('Football', '⚽', 'Rep your squad everywhere', 'phone', 2),
  ('Cars', '🏎️', 'JDM legends & supercar vibes', 'phone', 3),
  ('Urban Art', '🎨', 'Street culture meets phone art', 'phone', 4),
  ('Tech & Gaming', '🎮', 'Gaming logos & retro computing vibes', 'laptop', 5),
  ('Nature & Space', '🌌', 'Galaxies, landscapes & cosmic art', 'laptop', 6),
  ('Anime', '🎌', 'Epic anime art for your laptop', 'laptop', 7),
  ('Football', '⚽', 'Rep your squad on your laptop', 'laptop', 8),
  ('Cars', '🏎️', 'JDM & supercar laptop skins', 'laptop', 9),
  ('Urban Art', '🎨', 'Street art for your laptop', 'laptop', 10);

INSERT INTO public.style_options (name, price_modifier, sort_order) VALUES
  ('Matte', 0, 1), ('Glossy', 50, 2), ('Transparent', 30, 3), ('Holographic', 100, 4);

INSERT INTO public.site_content (key, value) VALUES
  ('hero_title_1', 'Drip'), ('hero_title_2', 'Stix'),
  ('hero_tagline', 'Premium Phone Stickers That Hit Different'),
  ('hero_cta', 'Shop Now');

INSERT INTO public.products (name, description, base_price, category_id, product_type, image, is_featured) VALUES
  ('Naruto Sage Mode', 'Naruto in full Sage Mode with epic chakra effects.', 350, (SELECT id FROM public.categories WHERE name='Anime' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop', true),
  ('Goku Ultra Instinct', 'Goku''s legendary Ultra Instinct form.', 350, (SELECT id FROM public.categories WHERE name='Anime' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=400&fit=crop', true),
  ('Messi GOAT', 'Lionel Messi celebrating in iconic style.', 300, (SELECT id FROM public.categories WHERE name='Football' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=400&fit=crop', true),
  ('Champions League', 'The iconic Champions League trophy.', 300, (SELECT id FROM public.categories WHERE name='Football' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=400&fit=crop', true),
  ('Nissan GTR R34', 'The legendary Skyline R34 GTR.', 320, (SELECT id FROM public.categories WHERE name='Cars' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop', false),
  ('Lamborghini Neon', 'Lamborghini Aventador with neon underglow.', 320, (SELECT id FROM public.categories WHERE name='Cars' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=400&h=400&fit=crop', false),
  ('Graffiti Skull', 'Bold graffiti-style skull artwork.', 280, (SELECT id FROM public.categories WHERE name='Urban Art' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=400&h=400&fit=crop', false),
  ('Neon Tiger', 'A fierce tiger in neon wireframe.', 300, (SELECT id FROM public.categories WHERE name='Urban Art' AND product_type='phone'), 'phone', 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=400&h=400&fit=crop', false),
  ('RGB Setup', 'Epic gaming setup with RGB vibes.', 350, (SELECT id FROM public.categories WHERE name='Tech & Gaming' AND product_type='laptop'), 'laptop', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop', true),
  ('Retro Console', 'Classic retro gaming pixel art.', 300, (SELECT id FROM public.categories WHERE name='Tech & Gaming' AND product_type='laptop'), 'laptop', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop', false),
  ('Galaxy Nebula', 'Stunning deep space nebula.', 320, (SELECT id FROM public.categories WHERE name='Nature & Space' AND product_type='laptop'), 'laptop', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop', true),
  ('Northern Lights', 'Aurora borealis across a starry sky.', 320, (SELECT id FROM public.categories WHERE name='Nature & Space' AND product_type='laptop'), 'laptop', 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=400&h=400&fit=crop', false);
