
-- Create affiliate_posters table
CREATE TABLE public.affiliate_posters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_posters ENABLE ROW LEVEL SECURITY;

-- Anyone can read active posters
CREATE POLICY "Anyone can read active posters" ON public.affiliate_posters
  FOR SELECT USING (is_active = true);

-- Admins manage posters
CREATE POLICY "Admins manage posters" ON public.affiliate_posters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for poster images
INSERT INTO storage.buckets (id, name, public) VALUES ('affiliate-posters', 'affiliate-posters', true);

-- Storage policies for poster images
CREATE POLICY "Anyone can view poster images" ON storage.objects
  FOR SELECT USING (bucket_id = 'affiliate-posters');

CREATE POLICY "Admins can upload poster images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'affiliate-posters' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete poster images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'affiliate-posters' AND public.has_role(auth.uid(), 'admin'::app_role));
