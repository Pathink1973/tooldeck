/*
  # Storage bucket and policies setup

  1. Storage Configuration
    - Creates upload-temp bucket if it doesn't exist
    - Sets bucket configuration (file size limit, mime types)
  
  2. Security
    - Drops existing policies to avoid conflicts
    - Creates new policies for authenticated users:
      - Upload files to their own folder
      - Download their own files
      - Delete their own files
*/

-- First create the bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('upload-temp', 'upload-temp', false)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Configure bucket settings
UPDATE storage.buckets 
SET public = false,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']::text[]
WHERE id = 'upload-temp';

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
END $$;

-- Create policy to allow authenticated users to upload files to their own folder
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'upload-temp' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to read their own files
CREATE POLICY "Allow authenticated downloads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'upload-temp'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'upload-temp'
  AND (storage.foldername(name))[1] = auth.uid()::text
);