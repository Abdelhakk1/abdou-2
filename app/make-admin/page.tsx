"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Shield, CheckCircle } from 'lucide-react';

const adminSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type AdminForm = z.infer<typeof adminSchema>;

export default function MakeAdmin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: AdminForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to make user admin');
      }

      const result = await response.json();
      toast.success('User has been made an admin successfully');
      setSuccess(true);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to make user admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center">
            <Shield className="h-6 w-6 mr-3" />
            Make User Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4">User Made Admin Successfully</h3>
              <p className="text-foreground/70 mb-6">
                The user now has admin access to the dashboard.
              </p>
              <Button 
                onClick={() => setSuccess(false)}
                className="btn-primary"
              >
                Make Another Admin
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">User Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter user email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Make Admin'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}