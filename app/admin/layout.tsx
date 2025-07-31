'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      const adminStatus = await admin.isAdmin(user!.id);
      if (!adminStatus) {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-foreground/70 mb-6">You don't have permission to access the admin dashboard.</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}