'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { X, User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  // Reset forms and force re-render when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormKey(prev => prev + 1);
      
      setTimeout(() => {
        signInForm.reset({
          email: '',
          password: '',
        });
        signUpForm.reset({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        setMode(defaultMode);
        
        if (defaultMode === 'signup' && fullNameInputRef.current) {
          fullNameInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen, defaultMode, signInForm, signUpForm]);

  // Handle mode switching with proper cleanup
  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setFormKey(prev => prev + 1);
    
    setTimeout(() => {
      if (newMode === 'signin') {
        signInForm.reset({
          email: '',
          password: '',
        });
      } else {
        signUpForm.reset({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        if (fullNameInputRef.current) {
          fullNameInputRef.current.focus();
        }
      }
    }, 50);
  };

  const onSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Welcome back!');
      onClose();
      // Refresh the current page to update auth state
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    try {
      await signUp(data.email, data.password, data.fullName, data.phone);
      toast.success('Account created successfully!');
      onClose();
      // Refresh the current page to update auth state
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white" key={`modal-${formKey}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {mode === 'signin' ? (
            <Form {...signInForm} key={`signin-${formKey}`}>
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            placeholder="Enter your email" 
                            className="pl-10" 
                            autoComplete="email"
                            type="email"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="pl-10" 
                            autoComplete="current-password"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signUpForm} key={`signup-${formKey}`}>
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <FormField
                  control={signUpForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            ref={fullNameInputRef}
                            placeholder="Enter your full name" 
                            className="pl-10" 
                            autoComplete="name"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            placeholder="Enter your email" 
                            className="pl-10" 
                            autoComplete="email"
                            type="email"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Phone (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            placeholder="Enter your phone number" 
                            className="pl-10" 
                            autoComplete="tel"
                            type="tel"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="pl-10" 
                            autoComplete="new-password"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                          <Input 
                            type="password" 
                            placeholder="Confirm your password" 
                            className="pl-10" 
                            autoComplete="new-password"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/70">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <Button
                variant="link"
                className="p-0 ml-1 text-foreground underline"
                onClick={() => handleModeSwitch(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}