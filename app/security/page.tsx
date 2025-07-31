"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/auth-modal';
import { 
  Lock, 
  Save,
  Shield,
  Mail
} from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const emailSchema = z.object({
  newEmail: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password is required to change email'),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type EmailForm = z.infer<typeof emailSchema>;

export default function Security() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      emailForm.setValue('newEmail', user.email || '');
    }
  }, [user, emailForm]);

  const onPasswordSubmit = async (data: PasswordForm) => {
    // Note: Password change would require Supabase auth update
    // This is a placeholder for the UI
    toast.info('Password change functionality will be implemented with proper authentication flow');
    passwordForm.reset();
  };

  const onEmailSubmit = async (data: EmailForm) => {
    // Note: Email change would require Supabase auth update
    // This is a placeholder for the UI
    toast.info('Email change functionality will be implemented with proper authentication flow');
    emailForm.reset();
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md bg-white text-center">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Access Security Settings</h2>
              <p className="text-foreground/70 mb-6">
                Please sign in to manage your security settings.
              </p>
              <Button 
                className="btn-primary w-full"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline">
            Security
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Manage your account security, including password and email changes.
          </p>
        </div>

        <div className="space-y-8">
          {/* Change Password */}
          <Card className="soft-shadow bg-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                <Lock className="h-6 w-6 mr-3" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                            <Input type="password" placeholder="Enter your current password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                            <Input type="password" placeholder="Enter your new password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                            <Input type="password" placeholder="Confirm your password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Change Email */}
          <Card className="soft-shadow bg-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                <Mail className="h-6 w-6 mr-3" />
                Change Email Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Current Email:</strong> {user.email}
                </p>
              </div>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="newEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">New Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                            <Input placeholder="Enter your new email" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                            <Input type="password" placeholder="Enter your password" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Card className="soft-shadow bg-yellow border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-foreground/80">
                <li className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols
                </li>
                <li className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  Don't reuse passwords from other websites
                </li>
                <li className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  Keep your email address up to date for important security notifications
                </li>
                <li className="flex items-start">
                  <span className="text-foreground mr-2">•</span>
                  Sign out of your account when using shared or public computers
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}