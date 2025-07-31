"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CalendarIcon, Cake, AlertCircle } from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/auth-modal';
import { customCakes } from '@/lib/custom-cakes';
// Removed supabase import - using API calls instead
import CloudinaryUpload from '@/components/ui/cloudinary-upload';

const weddingCakeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^(0)(5|6|7)[0-9]{8}$/, 'Please enter a valid Algerian phone number (e.g., 0555123456)'),
  weddingDate: z.date({
    required_error: 'Please select your wedding date',
  }),
  numberOfGuests: z.string().min(1, 'Number of guests is required'),
  numberOfTiers: z.string().min(1, 'Number of tiers is required'),
  flavorsPerTier: z.string().min(1, 'Please specify flavors per tier'),
  decorationTheme: z.string().min(1, 'Decoration theme is required'),
  colors: z.string().min(1, 'Please specify colors to include or avoid'),
  budget: z.string().optional(),
  deliveryOption: z.string().min(1, 'Please select a delivery option'),
  deliveryLocation: z.string().optional(),
  allergies: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type WeddingCakeForm = z.infer<typeof weddingCakeSchema>;

export default function WeddingCakeOrder() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspirationImageUrl, setInspirationImageUrl] = useState<string>('');
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [weddingOrdersOpen, setWeddingOrdersOpen] = useState(true);

  const form = useForm<WeddingCakeForm>({
    resolver: zodResolver(weddingCakeSchema),
    defaultValues: {
      name: '',
      phone: '',
      numberOfGuests: '',
      numberOfTiers: '',
      flavorsPerTier: '',
      decorationTheme: '',
      colors: '',
      budget: '',
      deliveryOption: '',
      deliveryLocation: '',
      allergies: '',
      additionalNotes: '',
    },
  });

  useEffect(() => {
    loadUnavailableDates();
    loadSystemSettings();
  }, []);

  const loadUnavailableDates = async () => {
    try {
      const response = await fetch('/api/admin/unavailable-dates');
      
      if (!response.ok) {
        throw new Error('Failed to load unavailable dates');
      }
      
      const data = await response.json();
      
      // Convert to array of date strings in format 'YYYY-MM-DD'
      const dates = (data || []).map((item: any) => item.date);
      setUnavailableDates(dates);
    } catch (error) {
      console.error('Error loading unavailable dates:', error);
    }
  };

  const loadSystemSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings?key=wedding_orders_open');
      
      if (!response.ok) {
        throw new Error('Failed to load system settings');
      }
      
      const data = await response.json();
      setWeddingOrdersOpen(data?.setting_value || false);
    } catch (error) {
      console.error('Error loading system settings:', error);
    }
  };

  const handleImageUpload = (url: string) => {
    setInspirationImageUrl(url);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const minDate = addDays(today, 14); // 2 weeks ahead minimum for wedding cakes
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return isBefore(date, minDate) || unavailableDates.includes(dateStr);
  };

  const onSubmit = async (data: WeddingCakeForm) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!weddingOrdersOpen) {
      toast.error('Wedding cake orders are currently closed. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    try {
      await customCakes.createOrder({
        userId: user.id,
        name: data.name,
        phone: data.phone,
        email: user.email || '',
        eventDate: format(data.weddingDate, 'yyyy-MM-dd'),
        size: `Wedding cake - ${data.numberOfTiers} tiers`,
        shape: 'circle', // Default shape for wedding cakes
        flavor: data.flavorsPerTier,
        pickupDelivery: data.deliveryOption,
        deliveryAddress: data.deliveryOption === 'delivery' ? data.deliveryLocation : '',
        additionalInfo: `
Wedding Cake Order
------------------
Number of Guests: ${data.numberOfGuests}
Number of Tiers: ${data.numberOfTiers}
Flavors per Tier: ${data.flavorsPerTier}
Decoration Theme: ${data.decorationTheme}
Colors: ${data.colors}
Budget: ${data.budget || 'Not specified'}
Allergies: ${data.allergies || 'None'}
Additional Notes: ${data.additionalNotes || 'None'}
        `,
        needCandles: false,
        inspirationImageUrl: inspirationImageUrl || undefined,
        cake_type: 'Wedding Cake',
      });
      
      toast.success('Wedding cake order submitted successfully! We\'ll contact you within 24 hours to discuss your design and provide a quote.');
      form.reset();
      setInspirationImageUrl('');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!weddingOrdersOpen) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-8 md:p-16">
              <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-foreground/30 mx-auto mb-4 md:mb-6" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6 font-display">Wedding Cake Orders Temporarily Closed</h1>
              <p className="text-base md:text-lg text-foreground/70 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                We're currently not accepting new wedding cake orders. This could be due to high demand, 
                scheduled maintenance, or holiday closures. Please check back soon or contact us for more information.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button asChild className="btn-primary w-full sm:w-auto">
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button asChild className="btn-outline w-full sm:w-auto">
                  <a href="/gallery">View Gallery</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 custom-underline font-display">
            Wedding Cake Order
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Let us create the perfect wedding cake for your special day. Please provide the details below and we'll work with you to design a beautiful cake that matches your vision.
          </p>
        </div>

        {/* Order Form - Mobile Optimized */}
        <Card className="soft-shadow bg-white border-0">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Your Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Phone Number (or WhatsApp) *</FormLabel>
                        <FormControl>
                          <Input placeholder="0555 123 456" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Wedding Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Wedding Details</h2>
                  
                  <FormField
                    control={form.control}
                    name="weddingDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground font-medium">Wedding Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full h-12 pl-4 text-left font-normal border-border hover:border-foreground',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Select wedding date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={isDateDisabled}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-foreground/60">
                          Wedding cake orders must be placed at least 2 weeks in advance
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Number of Guests *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 100" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cake Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Cake Details</h2>
                  
                  <FormField
                    control={form.control}
                    name="numberOfTiers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Number of Tiers (1, 2, 3, or "Not sure yet") *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="flavorsPerTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Flavor(s) per Tier *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Bottom tier: Vanilla, Middle tier: Chocolate, Top tier: Red Velvet"
                            className="border-border focus:border-foreground min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="decorationTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Decoration Theme or Style *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Rustic, Elegant, Modern, Floral" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="colors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Colors to Include or Avoid *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Include: white, gold, blush pink; Avoid: bright red" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your approximate budget in DA" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Inspiration Images */}
                <div>
                  <Label className="text-foreground font-medium block mb-2">Upload Inspiration Photo</Label>
                  <p className="text-sm text-foreground/70 mb-4">
                    Share an inspiration image of a wedding cake you like - we'll create an original design in our style based on your preferences.
                  </p>
                  <CloudinaryUpload
                    onUploadSuccess={setInspirationImageUrl}
                    existingImage={inspirationImageUrl}
                    folder="inspiration-images"
                    buttonText="Upload inspiration image"
                  />
                </div>

                {/* Delivery Options */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Delivery Options</h2>
                  
                  <FormField
                    control={form.control}
                    name="deliveryOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Delivery or Pick-up *</FormLabel>
                        <div className="space-y-3">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="delivery" id="delivery" />
                              <Label htmlFor="delivery">Delivery (additional fee applies)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pickup" id="pickup" />
                              <Label htmlFor="pickup">Pick-up (from our location)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('deliveryOption') === 'delivery' && (
                    <FormField
                      control={form.control}
                      name="deliveryLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">Delivery Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter delivery address and venue details" className="border-border focus:border-foreground h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Additional Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Allergies or Special Requests</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please list any allergies or dietary restrictions we should be aware of"
                            className="border-border focus:border-foreground min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Any Extra Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information or special requests for your wedding cake"
                            className="border-border focus:border-foreground min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button - Mobile Optimized */}
                <Button 
                  type="submit" 
                  className="w-full btn-primary text-base md:text-lg py-4 md:py-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Order...
                    </>
                  ) : (
                    'Submit Wedding Cake Order'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
}