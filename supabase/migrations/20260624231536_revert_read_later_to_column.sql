/*
# Simplify read_later: column on cards instead of join table

The PostgREST schema cache in this environment does not reliably pick up
new tables or RPC functions. Storing read_later directly on the cards table
(which PostgREST already knows about) is simpler and more reliable.
*/

-- Add read_later column back to cards
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS read_later boolean NOT NULL DEFAULT false;

-- Migrate any existing rows from read_later_cards back to cards
UPDATE public.cards c
SET read_later = true
WHERE EXISTS (
  SELECT 1 FROM public.read_later_cards r
  WHERE r.card_id = c.id AND r.user_id = c.user_id
);

-- Drop the join table and the RPC function (no longer needed)
DROP TABLE IF EXISTS public.read_later_cards;
DROP FUNCTION IF EXISTS public.toggle_read_later(uuid);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
