import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      // Get storage buckets
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      const bucketUsage = [];
      let totalSize = 0;
      let totalFiles = 0;
      
      // For each bucket, get files and calculate size
      for (const bucket of buckets) {
        const { data: files, error: filesError } = await supabase
          .storage
          .from(bucket.name)
          .list();
        
        if (filesError) {
          console.error(`Error fetching files for bucket ${bucket.name}:`, filesError);
          continue;
        }
        
        // Calculate total size for this bucket
        // Note: This is an approximation as we don't have direct file size info
        let bucketSize = 0;
        for (const file of files) {
          if (!file.metadata) continue;
          
          // Estimate file size based on type
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
            bucketSize += 500 * 1024; // 500KB for images
          } else if (['pdf'].includes(ext || '')) {
            bucketSize += 1024 * 1024; // 1MB for PDFs
          } else {
            bucketSize += 200 * 1024; // 200KB for other files
          }
        }
        
        // Bucket limits (based on Supabase free tier)
        const bucketLimit = bucket.name === 'receipts' ? 
          500 * 1024 * 1024 : // 500MB for receipts
          200 * 1024 * 1024;  // 200MB for other buckets
        
        bucketUsage.push({
          bucketName: bucket.name,
          totalSize: bucketSize,
          fileCount: files.length,
          limit: bucketLimit,
          percentUsed: (bucketSize / bucketLimit) * 100
        });
        
        totalSize += bucketSize;
        totalFiles += files.length;
      }
      
      // Calculate total usage
      const totalLimit = 1024 * 1024 * 1024; // 1GB Supabase free tier limit
      
      return NextResponse.json({
        buckets: bucketUsage,
        total: {
          totalSize,
          fileCount: totalFiles,
          limit: totalLimit,
          percentUsed: (totalSize / totalLimit) * 100
        }
      });
      
    } catch (error: any) {
      console.error('Error getting storage usage:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get storage usage' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const bucket = searchParams.get('bucket');
      const path = searchParams.get('path');
      
      if (!bucket || !path) {
        return NextResponse.json(
          { message: 'Bucket and path are required' },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting file:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to delete file' },
        { status: 500 }
      );
    }
  });
}