/*
  # Storage bucket policies for file uploads

  1. Changes
    - Create upload-temp bucket if it doesn't exist
    - Add policies for authenticated users to:
      - Upload files to their own folder
      - Read their own files
  
  2. Security
    - Files are isolated by user ID
    - Only authenticated users can access storage
    - Users can only access their own files
*/

-- First create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('upload-temp', 'upload-temp')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets 
SET public = false,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']
WHERE id = 'upload-temp';

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