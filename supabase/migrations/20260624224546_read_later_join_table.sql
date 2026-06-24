/*
# Read Later — replace column with join table

The `read_later` boolean column on `cards` caused PostgREST schema cache errors.
This migration removes it and creates a dedicated `read_later_cards` join table
(same pattern as `card_collections`).

1. Changes to existing tables
   - `cards`: DROP COLUMN `read_later` (safe — no user data lost, column was boolean)

2. New tables
   - `read_later_cards`: maps a user to a card they want to read later
     - `id` (uuid PK)
     - `user_id` (uuid FK → auth.users, NOT NULL DEFAULT auth.uid())
     - `card_id` (uuid FK → cards, NOT NULL)
     - `created_at` (timestamptz)
     - UNIQUE(user_id, card_id) — no duplicates

3. Security
   - RLS enabled on `read_later_cards`
   - SELECT / INSERT / DELETE policies scoped to the owning user
*/

ALTER TABLE public.cards DROP COLUMN IF EXISTS read_later;

CREATE TABLE IF NOT EXISTS public.read_later_cards (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id    uuid NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, card_id)
);

ALTER TABLE public.read_later_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_read_later" ON public.read_later_cards;
CREATE POLICY "select_own_read_later" ON public.read_later_cards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_read_later" ON public.read_later_cards;
CREATE POLICY "insert_own_read_later" ON public.read_later_cards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_read_later" ON public.read_later_cards;
CREATE POLICY "delete_own_read_later" ON public.read_later_cards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
