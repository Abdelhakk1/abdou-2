'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { 
  Database, 
  HardDrive, 
  Image, 
  FileText, 
  Trash2,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminStorage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      checkAdminAccess();
    }
  }, [user, loading, router]);

  const checkAdminAccess = async () => {
    try {
      const adminUser = await admin.isAdmin(user!.id);
      if (!adminUser) {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading storage management...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Storage Management</h1>
              <p className="text-lg text-foreground/70">Manage and optimize your storage usage</p>
            </div>
          </div>
        </div>

        {/* Storage Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <Card className="soft-shadow bg-white border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Storage Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Storage Management</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    This page allows you to manage your storage usage. Files are now stored on Cloudinary, 
                    which provides generous free tier limits and automatic optimization.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Storage Information</h3>
                  <ul className="text-sm text-foreground/70 space-y-2">
                    <li className="flex items-start">
                      <Image className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                      <span>Images are automatically optimized to WebP format on Cloudinary</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                      <span>Payment receipts are stored securely with automatic backup</span>
                    </li>
                    <li className="flex items-start">
                      <HardDrive className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>Cloudinary free tier includes 25GB storage and 25GB monthly bandwidth</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Migration Complete</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Your application has been successfully migrated from Supabase to PostgreSQL with Cloudinary for file storage. 
                    This provides better performance, reliability, and cost efficiency.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">Benefits:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Self-hosted PostgreSQL database for full control</li>
                      <li>• Cloudinary CDN for fast image delivery worldwide</li>
                      <li>• Automatic image optimization and format conversion</li>
                      <li>• No vendor lock-in with open-source technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}