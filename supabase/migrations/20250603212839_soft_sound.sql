/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - references auth.users.id
      - `email` (text, unique, not null)
      - `display_name` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on users table
    - Add policies for:
      - Users can read their own data
      - Users can update their own display_name
*/

-- Create users table if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    CREATE TABLE public.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      display_name text,
      created_at timestamptz DEFAULT now(),
      CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
    );
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$ BEGIN
  -- Check and create read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON public.users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Check and create update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Users can update own display_name'
  ) THEN
    CREATE POLICY "Users can update own display_name"
      ON public.users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create indexes with safety checks
DO $$ BEGIN
  -- Check and create email index
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'users' AND indexname = 'users_email_idx'
  ) THEN
    CREATE INDEX users_email_idx ON public.users (email);
  END IF;

  -- Check and create created_at index
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'users' AND indexname = 'users_created_at_idx'
  ) THEN
    CREATE INDEX users_created_at_idx ON public.users (created_at DESC);
  END IF;
END $$;