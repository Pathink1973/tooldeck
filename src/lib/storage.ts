import { supabase } from './supabase';

export async function uploadToSupabaseStorage(file: File, cardId: string): Promise<string> {
  try {
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      throw new Error('File must be JPEG, PNG, or GIF');
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomId}.${fileExt}`;
    const filePath = `${cardId}/${fileName}`; // Remove upload-temp from here as it's part of the bucket name
    
    // Create bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === 'upload-temp')) { // Changed bucket name to match the trigger
      const { error: createError } = await supabase.storage.createBucket('upload-temp', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
      });

      if (createError) throw createError;
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('upload-temp') // Changed to match the bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL from Supabase
    const { data: { publicUrl } } = supabase.storage
      .from('upload-temp') // Changed to match the bucket name
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadToSupabaseStorage:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}