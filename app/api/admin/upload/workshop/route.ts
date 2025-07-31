import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { fileUpload } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { message: 'No file uploaded' },
          { status: 400 }
        );
      }

      const url = await fileUpload.uploadWorkshopImage(file);
      
      return NextResponse.json({ url });
    } catch (error: any) {
      console.error('Error uploading workshop image:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to upload image' },
        { status: 500 }
      );
    }
  });
}