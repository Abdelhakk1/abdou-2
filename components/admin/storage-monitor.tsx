'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database, HardDrive, Image, FileText, AlertCircle } from 'lucide-react';
// Removed supabase import - using API calls instead

interface StorageUsage {
  bucketName: string;
  totalSize: number;
  fileCount: number;
  limit: number;
  percentUsed: number;
}

export default function StorageMonitor() {
  const [isLoading, setIsLoading] = useState(true);
  const [storageData, setStorageData] = useState<StorageUsage[]>([]);
  const [totalUsage, setTotalUsage] = useState<StorageUsage>({
    bucketName: 'Total',
    totalSize: 0,
    fileCount: 0,
    limit: 1024 * 1024 * 1024, // 1GB Supabase free tier limit
    percentUsed: 0
  });

  useEffect(() => {
    fetchStorageUsage();
  }, []);

  const fetchStorageUsage = async () => {
    try {
      setIsLoading(true);
      
      // Get storage buckets
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketsError) throw bucketsError;
      
      const bucketUsage: StorageUsage[] = [];
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
        // We're using a rough estimate based on file types
        let bucketSize = 0;
        for (const file of files) {
          if (!file.metadata) continue;
          
          // Estimate file size based on type
          // Images ~500KB, PDFs ~1MB, other files ~200KB
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
      
      setStorageData(bucketUsage);
      setTotalUsage({
        bucketName: 'Total',
        totalSize,
        fileCount: totalFiles,
        limit: totalLimit,
        percentUsed: (totalSize / totalLimit) * 100
      });
      
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const getBucketIcon = (bucketName: string) => {
    switch (bucketName) {
      case 'gallery':
        return <Image className="h-5 w-5 text-blue-600" />;
      case 'receipts':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'inspiration-images':
        return <Image className="h-5 w-5 text-purple-600" />;
      case 'workshop-images':
        return <Image className="h-5 w-5 text-orange-600" />;
      case 'Total':
        return <Database className="h-5 w-5 text-foreground" />;
      default:
        return <HardDrive className="h-5 w-5 text-gray-600" />;
    }
  };

  const getProgressColor = (percentUsed: number): string => {
    if (percentUsed < 50) return 'bg-green-600';
    if (percentUsed < 80) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  if (isLoading) {
    return (
      <Card className="soft-shadow bg-white border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null; // Return null to hide the storage monitor component
}