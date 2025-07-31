"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { courses } from '@/lib/courses';
import { admin } from '@/lib/admin';
import AuthModal from '@/components/auth/auth-modal';
import { 
  PlayCircle, 
  Users, 
  Clock, 
  Award, 
  CheckCircle, 
  MessageCircle, 
  Video,
  BookOpen,
  Star,
  Upload,
  CreditCard,
  X,
  FileText,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  paymentMethod: z.enum(['baridimob', 'ccp'], {
    required_error: 'Please select a payment method',
  }),
});

const receiptSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  notes: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;
type ReceiptForm = z.infer<typeof receiptSchema>;

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.id as string;
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderForm = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const receiptForm = useForm<ReceiptForm>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      amount: '',
      notes: '',
    },
  });

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const courseData = await admin.getOnlineCourses();
      const foundCourse = courseData.find(c => c.id === courseId && c.status === 'active');
      if (!foundCourse) {
        toast.error('Course not found');
        return;
      }
      setCourse(foundCourse);
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowOrderForm(true);
  };

  const onOrderSubmit = async (data: OrderForm) => {
    if (!user || !course) {
      toast.error('Please sign in to continue');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await courses.createOrder({
        userId: user.id,
        courseName: course.title,
        amount: course.discount_price || course.price,
        paymentMethod: data.paymentMethod,
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      
      setOrderData({ ...data, orderId: order.id });
      setShowOrderForm(false);
      setShowReceiptUpload(true);
      
      toast.success('Order placed successfully! Please complete the payment and upload your receipt.');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onReceiptSubmit = async (data: ReceiptForm) => {
    if (!uploadedFile || !orderData) {
      toast.error('Please upload your payment receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      await courses.uploadReceipt(uploadedFile, orderData.orderId, {
        transactionNumber: `AUTO_${Date.now()}`, // Auto-generate transaction number
        amount: data.amount,
        notes: data.notes,
      });
      
      toast.success('Receipt uploaded successfully! Your order is pending verification. You will be notified when access to your course is available.');
      setShowReceiptUpload(false);
      receiptForm.reset();
      setUploadedFile(null);
      setOrderData(null);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-white text-center">
          <CardContent className="p-8">
            <BookOpen className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h2>
            <p className="text-foreground/70 mb-6">
              The course you&apos;re looking for doesn&apos;t exist or is no longer available.
            </p>
            <Button asChild className="btn-primary">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="btn-outline">
            <Link href="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>

        {/* Course Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline">
            {course.title}
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Card className="soft-shadow bg-white border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                  <BookOpen className="h-6 w-6 mr-3" />
                  Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground/80 leading-relaxed">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-peach rounded-lg p-6 mb-4">
                      <Clock className="h-8 w-8 text-foreground mx-auto" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{course.duration_hours || 7}+ Hours</h3>
                    <p className="text-sm text-foreground/70">Total Content</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-lavender rounded-lg p-6 mb-4">
                      <PlayCircle className="h-8 w-8 text-foreground mx-auto" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{course.module_count || 9} Modules</h3>
                    <p className="text-sm text-foreground/70">Comprehensive Lessons</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-mint rounded-lg p-6 mb-4">
                      <Users className="h-8 w-8 text-foreground mx-auto" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">Lifetime Access</h3>
                    <p className="text-sm text-foreground/70">Learn at Your Pace</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
              <Card className="soft-shadow bg-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">Course Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors">
                        <div className="bg-foreground text-background rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{module.title}</h3>
                            {module.duration && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {module.duration}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground/70">{module.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Course Image */}
            {course.image_url && (
              <div className="relative rounded-lg overflow-hidden soft-shadow">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Pricing Card */}
            <Card className="soft-shadow bg-yellow border-0">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {course.discount_price ? course.discount_price.toLocaleString() : course.price.toLocaleString()} DA
                  </div>
                  {course.discount_price && (
                    <div className="text-foreground/50 line-through">
                      {course.price.toLocaleString()} DA
                    </div>
                  )}
                  <div className="text-foreground/70">One-time payment</div>
                </div>
                
                <div className="space-y-3 mb-8 text-left">
                  {course.features && course.features.length > 0 ? (
                    course.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>Comprehensive video modules</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>Private Telegram group access</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>Q&A support group</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span>Lifetime access to content</span>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  className="w-full btn-primary text-lg py-6 mb-4"
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
                
                <p className="text-xs text-foreground/60">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="soft-shadow bg-white border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CreditCard className="h-6 w-6 text-foreground" />
                  <div>
                    <h4 className="font-semibold text-foreground">BaridiMob</h4>
                    <p className="text-xs text-foreground/70">Mobile payment via BaridiMob app</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <FileText className="h-6 w-6 text-foreground" />
                  <div>
                    <h4 className="font-semibold text-foreground">CCP</h4>
                    <p className="text-xs text-foreground/70">Bank transfer to CCP account</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground">
                  Enroll in Course
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOrderForm(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Form {...orderForm}>
                  <form onSubmit={orderForm.handleSubmit(onOrderSubmit)} className="space-y-4">
                    <FormField
                      control={orderForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="0555 123 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Payment Method *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="baridimob" id="baridimob" />
                                <Label htmlFor="baridimob">BaridiMob</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="ccp" id="ccp" />
                                <Label htmlFor="ccp">CCP Bank Transfer</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-4">
                      <Button 
                        type="submit"
                        className="flex-1 btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setShowOrderForm(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Receipt Upload Modal */}
        {showReceiptUpload && orderData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground">
                  Complete Payment
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReceiptUpload(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions</h3>
                      {orderData.paymentMethod === 'baridimob' ? (
                        <div className="text-sm text-blue-800">
                          <p className="mb-2"><strong>BaridiMob Payment:</strong></p>
                          <p className="mb-1">RIP Number: <strong>00799999001234567890</strong></p>
                          <p className="mb-2">Amount: <strong>{course.discount_price || course.price} DA</strong></p>
                          <p>Complete the payment via BaridiMob app and upload your receipt below.</p>
                        </div>
                      ) : (
                        <div className="text-sm text-blue-800">
                          <p className="mb-2"><strong>CCP Bank Transfer:</strong></p>
                          <p className="mb-1">Account Number: <strong>1234567890</strong></p>
                          <p className="mb-1">Account Holder: <strong>Soundous Bake Shop</strong></p>
                          <p className="mb-2">Amount: <strong>{course.discount_price || course.price} DA</strong></p>
                          <p>Complete the bank transfer and upload your receipt below.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Receipt Upload Form */}
                <Form {...receiptForm}>
                  <form onSubmit={receiptForm.handleSubmit(onReceiptSubmit)} className="space-y-4">
                    <div>
                      <Label className="text-foreground font-medium">Upload Receipt (PDF or Image) *</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-foreground hover:file:bg-primary/80"
                        />
                        {uploadedFile && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {uploadedFile.name} uploaded
                          </p>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={receiptForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount Paid *</FormLabel>
                          <FormControl>
                            <Input placeholder={`${course.discount_price || course.price} DA`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={receiptForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional information about the payment..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-4">
                      <Button 
                        type="submit"
                        className="flex-1 btn-primary"
                        disabled={isSubmitting || !uploadedFile}
                      >
                        {isSubmitting ? 'Uploading...' : 'Upload Receipt'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setShowReceiptUpload(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}