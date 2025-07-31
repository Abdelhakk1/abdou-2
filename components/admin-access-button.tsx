'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminAccessButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin: checkIsAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const handleAdminAccess = () => {
    router.push('/admin');
  };

  // Return null to remove the button completely
  return null;
}