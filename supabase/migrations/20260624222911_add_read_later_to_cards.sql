ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS read_later boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS cards_read_later_idx ON public.cards(user_id, read_later);
