import { v2 as cloudinary } from 'cloudinary';

// Validate required environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Missing Cloudinary environment variables');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName || '',
  api_key: apiKey || '',
  api_secret: apiSecret || '',
  secure: true,
});

// Cloudinary configuration for client-side
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'soundous_bakes',
};

// Helper function to optimize Cloudinary URLs
export const optimizeCloudinaryUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Default options
  const {
    width = 800,
    height,
    quality = 80,
    format = 'webp',
    crop = 'fill'
  } = options;

  // Split the URL to insert transformation parameters
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Build transformation string
  let transformation = 'f_' + format + ',q_' + quality;
  
  if (width) transformation += ',w_' + width;
  if (height) transformation += ',h_' + height;
  if (crop) transformation += ',c_' + crop;

  // Reconstruct URL with transformations
  return parts[0] + '/upload/' + transformation + '/' + parts[1];
};

export default cloudinary;