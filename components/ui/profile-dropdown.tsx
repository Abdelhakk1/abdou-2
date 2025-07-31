"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, Lock, Shield, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminStatus = await admin.isAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/admin');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground hover:text-foreground/70 h-10 w-10">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-foreground">
          {user.user_metadata?.full_name || user.email}
        </div>
        <DropdownMenuSeparator />
        
        {/* My Dashboard */}
        <DropdownMenuItem asChild>
          <Link href="/my-courses" className="flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            My Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {/* My Profile */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Link>
        </DropdownMenuItem>
        
        {/* Security */}
        <DropdownMenuItem asChild>
          <Link href="/security" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </Link>
        </DropdownMenuItem>

        {/* Admin Dashboard (if admin) */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center text-blue-600 cursor-pointer"
              onClick={handleAdminClick}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600 cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}