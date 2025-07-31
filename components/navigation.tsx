"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LayoutDashboard, Lock, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import AuthModal from '@/components/auth/auth-modal';
import ProfileDropdown from '@/components/ui/profile-dropdown';
import { useRouter, usePathname } from 'next/navigation';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/custom', label: 'Custom Cakes' },
    { href: '/wedding', label: 'Wedding Cakes' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/courses', label: 'Online Courses' },
    { href: '/workshops', label: 'Workshops' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/admin');
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
        scrolled ? 'bg-background/95 backdrop-blur-sm soft-shadow' : 'bg-background'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Mobile Optimized */}
            <Link href="/" className="flex items-center group" onClick={handleNavClick}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-script text-foreground mb-1">
                  Soundous
                </div>
                <div className="text-xs font-medium text-foreground tracking-[0.2em] uppercase">
                  BAKE SHOP
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-foreground/70 transition-colors duration-200 font-medium text-sm uppercase tracking-wide py-2"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Admin Dashboard Button (Desktop) */}
              {isAdmin && user && (
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium text-sm uppercase tracking-wide py-2 flex items-center"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              )}
            </div>

            {/* Right side - Auth - Mobile Optimized */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading ? (
                <div className="w-10 h-10 animate-pulse bg-foreground/20 rounded-full"></div>
              ) : user ? (
                <ProfileDropdown />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-foreground/70 h-10 w-10"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile menu button - Larger touch target */}
            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground h-12 w-12 mobile-menu-container"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Improved with better UX */}
          <div className={`lg:hidden mobile-menu-container transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-screen opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible overflow-hidden'
          }`}>
            <div className="bg-background border-t border-border safe-area-bottom">
              <div className="px-2 pt-4 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mobile-nav-item block px-4 py-4 text-foreground hover:bg-primary/20 rounded-lg transition-colors duration-200 font-medium text-base uppercase tracking-wide"
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Admin Dashboard Link (Mobile) */}
                {isAdmin && user && (
                  <a
                    href="/admin"
                    className="mobile-nav-item block px-4 py-4 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium text-base uppercase tracking-wide flex items-center"
                    onClick={handleAdminClick}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Dashboard
                  </a>
                )}
                
                {/* Mobile Auth - Improved */}
                <div className="pt-4 border-t border-border">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-foreground/70 border-b border-border mb-2">
                        {user.user_metadata?.full_name || user.email}
                      </div>
                      
                      {/* My Dashboard */}
                      <Link
                        href="/my-courses"
                        className="mobile-nav-item block w-full text-left px-4 py-4 text-foreground hover:bg-primary/20 rounded-lg transition-colors duration-200 font-medium text-base"
                        onClick={handleNavClick}
                      >
                        <LayoutDashboard className="h-5 w-5 mr-3 inline" />
                        My Dashboard
                      </Link>
                      
                      {/* My Profile */}
                      <Link
                        href="/profile"
                        className="mobile-nav-item block w-full text-left px-4 py-4 text-foreground hover:bg-primary/20 rounded-lg transition-colors duration-200 font-medium text-base"
                        onClick={handleNavClick}
                      >
                        <User className="h-5 w-5 mr-3 inline" />
                        My Profile
                      </Link>
                      
                      {/* Security */}
                      <Link
                        href="/security"
                        className="mobile-nav-item block w-full text-left px-4 py-4 text-foreground hover:bg-primary/20 rounded-lg transition-colors duration-200 font-medium text-base"
                        onClick={handleNavClick}
                      >
                        <Lock className="h-5 w-5 mr-3 inline" />
                        Security
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="mobile-nav-item block w-full text-left px-4 py-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium text-base"
                      >
                        <LogOut className="h-5 w-5 mr-3 inline" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        handleNavClick();
                      }}
                      className="mobile-nav-item block w-full text-left px-4 py-4 text-foreground hover:bg-primary/20 rounded-lg transition-colors duration-200 font-medium text-base"
                    >
                      <User className="h-5 w-5 mr-3 inline" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navigation;