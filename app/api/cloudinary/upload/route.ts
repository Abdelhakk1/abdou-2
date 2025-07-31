import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // Validate required environment variables
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Missing required Cloudinary environment variables');
      }

      const formData = await req.formData();
      const file = formData.get('file') as File;
      const folder = formData.get('folder') as string || 'general';
      
      if (!file) {
        return NextResponse.json(
          { message: 'No file uploaded' },
          { status: 400 }
        );
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
          { status: 400 }
        );
      }

      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: `soundous_bakes/${folder}`,
        resource_type: 'auto',
        format: 'webp',
        quality: 80,
        transformation: [
          { width: 1200, crop: "limit" }
        ]
      });

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id
      });
    } catch (error: any) {
      console.error('Error uploading to Cloudinary:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to upload image' },
        { status: 500 }
      );
    }
  });
}