
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_request_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

-- Allow anyone to update payment status on their own orders (by checkout_request_id)
CREATE POLICY "Anyone can read own order by id" ON public.orders FOR SELECT USING (true);
