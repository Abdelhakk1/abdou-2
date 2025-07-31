import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// This is a server-side only API route
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!folder) {
      return NextResponse.json(
        { message: 'Folder is required' },
        { status: 400 }
      );
    }

    // Validate file size (15MB max)
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size exceeds 15MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only images and PDFs are allowed.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const filename = `${uuidv4()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return public URL
    const url = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      url,
      filename,
      size: file.size
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}