/*
  # Add Collections/Categories Feature

  ## Summary
  Adds the ability for users to organize their cards into named collections (categories).
  For example: "Academia crIA", "Design Tools", "Dev Resources".

  ## New Tables
  - `collections`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to auth.users)
    - `name` (text) - The custom collection name
    - `description` (text, optional) - Short description of the collection
    - `color` (text) - Hex color for visual distinction
    - `created_at` (timestamptz)

  - `card_collections`
    - `card_id` (uuid, foreign key to cards)
    - `collection_id` (uuid, foreign key to collections)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Users can only view/create/update/delete their own collections
  - Card-collection links are controlled by collection ownership

  ## Notes
  - A card can belong to multiple collections
  - Collections are user-scoped (not shared)
  - Indexes added for performance on user_id and collection lookups
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#6366F1',
  created_at timestamptz DEFAULT now()
);

-- Create junction table for card-collection relationships
CREATE TABLE IF NOT EXISTS card_collections (
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (card_id, collection_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS collections_user_id_idx ON collections(user_id);
CREATE INDEX IF NOT EXISTS card_collections_card_id_idx ON card_collections(card_id);
CREATE INDEX IF NOT EXISTS card_collections_collection_id_idx ON card_collections(collection_id);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_collections ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Card-collections policies (based on collection ownership)
CREATE POLICY "Users can view own card-collection links"
  ON card_collections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = card_collections.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create card-collection links"
  ON card_collections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = card_collections.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete card-collection links"
  ON card_collections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = card_collections.collection_id
      AND collections.user_id = auth.uid()
    )
  );
