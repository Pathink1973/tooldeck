/*
  # Initial schema setup
  
  1. Tables
    - cards: Store user's saved resources
    - ai_metadata: Store AI-generated metadata for cards
  
  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
  
  3. Performance
    - Add indexes for common queries
*/

-- Create cards table
CREATE TABLE IF NOT EXISTS public.cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  link_url text NOT NULL,
  tags text[] DEFAULT '{}',
  favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on cards
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Create policies for cards with safety checks
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Users can read own cards'
  ) THEN
    CREATE POLICY "Users can read own cards"
      ON public.cards
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Users can create cards'
  ) THEN
    CREATE POLICY "Users can create cards"
      ON public.cards
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Users can update own cards'
  ) THEN
    CREATE POLICY "Users can update own cards"
      ON public.cards
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Users can delete own cards'
  ) THEN
    CREATE POLICY "Users can delete own cards"
      ON public.cards
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create ai_metadata table
CREATE TABLE IF NOT EXISTS public.ai_metadata (
  card_id uuid PRIMARY KEY REFERENCES public.cards(id) ON DELETE CASCADE,
  ai_description text,
  ai_tags text[] DEFAULT '{}',
  ai_score numeric DEFAULT 0
);

-- Enable RLS on ai_metadata
ALTER TABLE public.ai_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_metadata with safety checks
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_metadata' AND policyname = 'Users can read ai_metadata for own cards'
  ) THEN
    CREATE POLICY "Users can read ai_metadata for own cards"
      ON public.ai_metadata
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.cards
          WHERE cards.id = ai_metadata.card_id
          AND cards.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_metadata' AND policyname = 'Users can create ai_metadata for own cards'
  ) THEN
    CREATE POLICY "Users can create ai_metadata for own cards"
      ON public.ai_metadata
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.cards
          WHERE cards.id = ai_metadata.card_id
          AND cards.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_metadata' AND policyname = 'Users can update ai_metadata for own cards'
  ) THEN
    CREATE POLICY "Users can update ai_metadata for own cards"
      ON public.ai_metadata
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.cards
          WHERE cards.id = ai_metadata.card_id
          AND cards.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.cards
          WHERE cards.id = ai_metadata.card_id
          AND cards.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create indexes for better performance
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'cards' AND indexname = 'cards_user_id_idx'
  ) THEN
    CREATE INDEX cards_user_id_idx ON public.cards(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'cards' AND indexname = 'cards_created_at_idx'
  ) THEN
    CREATE INDEX cards_created_at_idx ON public.cards(created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'cards' AND indexname = 'cards_tags_idx'
  ) THEN
    CREATE INDEX cards_tags_idx ON public.cards USING GIN(tags);
  END IF;
END $$;