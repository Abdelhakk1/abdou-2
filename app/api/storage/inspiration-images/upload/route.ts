import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { fileUpload } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const path = formData.get('path') as string;
      
      if (!file) {
        return NextResponse.json(
          { message: 'No file uploaded' },
          { status: 400 }
        );
      }

      // Extract user ID from path
      const pathParts = path.split('/');
      const pathUserId = pathParts[0];
      
      // Ensure user can only upload to their own folder
      if (user.id !== pathUserId) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 403 }
        );
      }

      const url = await fileUpload.uploadInspirationImage(file, user.id);
      
      return NextResponse.json({ path: url });
    } catch (error: any) {
      console.error('Error uploading inspiration image:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to upload inspiration image' },
        { status: 500 }
      );
    }
  });
}