/*
  # Add storage trigger for Cloudinary integration

  1. Changes
    - Create function to handle storage changes
    - Create trigger on storage.objects table
    - Function will invoke cloudinary-uploader edge function when images are uploaded

  2. Security
    - Function runs with security definer to ensure proper permissions
    - Only processes files in the upload-temp folder
*/

-- Create the function to handle storage changes
CREATE OR REPLACE FUNCTION handle_storage_update()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only process files in the upload-temp folder
  IF NEW.name LIKE 'upload-temp/%' THEN
    -- Invoke the cloudinary-uploader edge function
    PERFORM
      net.http_post(
        url := current_setting('app.settings.edge_function_url') || '/cloudinary-uploader',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.anon_key')
        ),
        body := jsonb_build_object(
          'record', jsonb_build_object(
            'bucket', NEW.bucket_id,
            'name', NEW.name
          )
        )::text
      );
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_storage_changes'
  ) THEN
    CREATE TRIGGER handle_storage_changes
      AFTER INSERT ON storage.objects
      FOR EACH ROW
      EXECUTE FUNCTION handle_storage_update();
  END IF;
END $$;