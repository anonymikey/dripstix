CREATE TABLE public.ai_chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  message text NOT NULL,
  intent text,
  phone_number text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_chat_logs_created ON public.ai_chat_logs (created_at DESC);

ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat logs"
  ON public.ai_chat_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view chat logs"
  ON public.ai_chat_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));