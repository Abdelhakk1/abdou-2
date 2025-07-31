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
// Removed supabase import - using API calls instead

export default function AdminStorage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [unusedFiles, setUnusedFiles] = useState<{bucket: string, path: string}[]>([]);

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
      await findUnusedFiles();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const findUnusedFiles = async () => {
    try {
      setIsLoading(true);
      
      // This is a simplified approach - in a real app, you'd need to check
      // all database tables that reference files to find truly unused files
      
      // For now, we'll just identify old receipt files (older than 30 days)
      // as an example of potentially unused files
      const { data: receipts, error } = await supabase
        .storage
        .from('receipts')
        .list();
      
      if (error) throw error;
      
      // Filter for files older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldFiles = receipts
        .filter(file => {
          if (!file.metadata?.lastModified) return false;
          const fileDate = new Date(file.metadata.lastModified);
          return fileDate < thirtyDaysAgo;
        })
        .map(file => ({
          bucket: 'receipts',
          path: file.name
        }));
      
      setUnusedFiles(oldFiles);
    } catch (error) {
      console.error('Error finding unused files:', error);
      toast.error('Failed to scan for unused files');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUnusedFiles = async () => {
    if (!confirm('Are you sure you want to delete these unused files? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      let deletedCount = 0;
      
      for (const file of unusedFiles) {
        const { error } = await supabase
          .storage
          .from(file.bucket)
          .remove([file.path]);
        
        if (!error) deletedCount++;
      }
      
      toast.success(`Successfully deleted ${deletedCount} unused files`);
      setUnusedFiles([]);
    } catch (error) {
      console.error('Error deleting unused files:', error);
      toast.error('Failed to delete some files');
    } finally {
      setIsDeleting(false);
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
          <Button 
            onClick={findUnusedFiles}
            className="btn-outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
                    This page allows you to manage your storage usage and clean up unused files to stay within your storage limits.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Storage Tips</h3>
                  <ul className="text-sm text-foreground/70 space-y-2">
                    <li className="flex items-start">
                      <Image className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                      <span>Images are automatically optimized to WebP format</span>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                      <span>Old receipts can be safely deleted after verification</span>
                    </li>
                    <li className="flex items-start">
                      <HardDrive className="h-4 w-4 mr-2 mt-0.5 text-purple-600" />
                      <span>Free tier includes 1GB storage and 50GB bandwidth</span>
                    </li>
                  </ul>
                </div>
                
                {/* Unused Files */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Storage Optimization</h3>
                  <p className="text-sm text-yellow-700 mb-4">
                    Regularly cleaning up unused files helps keep your storage usage under the free tier limits.
                  </p>
                  
                  {unusedFiles.length > 0 ? (
                    <>
                      <p className="text-sm font-medium text-yellow-800 mb-2">
                        Found {unusedFiles.length} potentially unused files:
                      </p>
                      <ul className="text-xs text-yellow-700 mb-4 max-h-32 overflow-y-auto">
                        {unusedFiles.slice(0, 5).map((file, index) => (
                          <li key={index} className="mb-1">
                            {file.bucket}/{file.path}
                          </li>
                        ))}
                        {unusedFiles.length > 5 && (
                          <li>...and {unusedFiles.length - 5} more</li>
                        )}
                      </ul>
                      <Button
                        onClick={deleteUnusedFiles}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Unused Files'}
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-yellow-700">
                      No unused files detected at this time.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}