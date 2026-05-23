// Constants for Cloudinary configuration
const CLOUD_NAME = 'dfeqzodi3';
const UPLOAD_PRESET = 'ml_default';

export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    // Convert File to base64
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data URL prefix
      };
      reader.readAsDataURL(file);
    });

    // Upload to Cloudinary with folder specification
    const result = await new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', `data:${file.type};base64,${base64Data}`);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'tooldeck'); // Specify the folder

      fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export function getCloudinaryUrl(publicId: string, options = {}): string {
  const defaultOptions = {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  const transformations = Object.entries(mergedOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}