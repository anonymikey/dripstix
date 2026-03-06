-- Drop the unsafe permissive SELECT policy that exposes all orders to anonymous users
DROP POLICY IF EXISTS "Anyone can read own order by id" ON public.orders;