/*
  # Configure storage bucket for temporary uploads
  
  1. Changes
    - Creates a private storage bucket for temporary file uploads
    - Sets file size limit to 5MB
    - Restricts allowed file types to images (JPEG, PNG, GIF)
    
  Note: Storage policies are managed through the Supabase Dashboard
*/

-- Create storage bucket with proper configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('upload-temp', 'upload-temp', false)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 5242880, -- 5MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif']::text[];