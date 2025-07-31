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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CalendarIcon, Cake, AlertCircle } from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/auth-modal';
import { customCakes } from '@/lib/custom-cakes';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';

// Define the cake sizes and flavors with prices
const cakeSizesAndFlavors = {
  '10cm': {
    'Vanilla': 2000,
    'Chocolate': 2300,
    'Vanilla fraise': 2600,
    'Pistachio framboise': 2800
  },
  '12cm': {
    'Vanilla': 2800,
    'Chocolate': 3000,
    'Vanilla fraise': 3800,
    'Pistachio framboise': 3800
  },
  '15cm': {
    'Vanilla': 3500,
    'Chocolate': 4000,
    'Vanilla fraise': 4800,
    'Pistachio framboise': 4800
  },
  '20cm': {
    'Vanilla': 6800,
    'Chocolate': 7500,
    'Vanilla fraise': 8800,
    'Pistachio framboise': 8800
  },
  '25cm': {
    'Vanilla': 8800,
    'Chocolate': 9500,
    'Vanilla fraise': 11000,
    'Pistachio framboise': 13000
  }
};

// Define supplements with prices
const supplements = [
  { id: 'noix_noisettes', label: 'Noix, noisettes', price: 100 },
  { id: 'cacahuetes', label: 'Cacahuètes', price: 100 },
  { id: 'amandes', label: 'Amandes', price: 100 },
  { id: 'croustillant_chocolat', label: 'Croustillant chocolat', price: 200 },
  { id: 'pate_fraise', label: 'Pate de fraise', price: 250 },
  { id: 'pate_framboise', label: 'Pate de framboise', price: 250 },
  { id: 'pate_cerise', label: 'Pate de cerise', price: 250 },
  { id: 'banana', label: 'Banana', price: 150 },
  { id: 'caramel_beurre_sale', label: 'Caramel beurre salé', price: 250 },
  { id: 'chocolat_kinder_bueno', label: 'Chocolat kinder bueno', price: 300 },
  { id: 'chocolat_moment', label: 'Chocolat moment', price: 100 }
];

// Define toppings with prices
const toppings = [
  { id: 'artificial_roses', label: 'Artificial roses', price: 200 },
  { id: 'real_flowers', label: 'Real flowers', price: 300 },
  { id: 'happy_birthday_topper', label: 'Happy birthday topper', price: 250 },
  { id: 'candles', label: 'Candles', price: 120 },
  { id: 'butterflies', label: 'Butterflies', price: 100 },
  { id: 'rubans', label: 'Rubans', price: 100 }
];

// Define packaging options
const packagingOptions = [
  { id: 'simple', label: 'Simple packaging', price: 0 },
  { id: 'boite_transparente', label: 'Boite transparente', price: 300 }
];

// Define delivery options
const deliveryOptions = [
  { id: 'delivery', label: 'Delivery (200 - 800 da)', price: 0 },
  { id: 'pickup', label: 'Récupération (nouvelle ville uv 20)', price: 0 }
];

// Define delivery locations
const deliveryLocations = [
  { id: 'nouvelle_ville', label: 'Nouvelle ville', price: 300 },
  { id: 'zouaghi', label: 'Zouaghi', price: 350 },
  { id: 'centre_ville', label: 'Centre ville, CHU, Bossouf', price: 350 },
  { id: 'lekhroub', label: 'Lekhroub, SMK, Ain smara', price: 400 },
  { id: 'universite', label: 'Université 2-3', price: 300 }
];

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  instagramUsername: z.string().min(1, 'Instagram username is required'),
  phone: z.string().regex(/^(0)(5|6|7)[0-9]{8}$/, 'Please enter a valid Algerian phone number (e.g., 0555123456)'),
  location: z.string().min(1, 'Your location is required'),
  eventDate: z.date({
    required_error: 'Please select an event date',
  }),
  cakeMessage: z.string().optional(),
  sizeFlavor: z.string().min(1, 'Please select a cake size and flavor'),
  shape: z.string().min(1, 'Please select a cake shape'),
  supplements: z.array(z.string()).optional(),
  topping: z.string().optional(),
  packaging: z.string().optional(),
  deliveryOption: z.string().min(1, 'Please select a delivery option'),
  deliveryLocation: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function Custom() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspirationImageUrl, setInspirationImageUrl] = useState<string>('');
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [customOrdersOpen, setCustomOrdersOpen] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      instagramUsername: '',
      phone: '',
      location: '',
      cakeMessage: '',
      sizeFlavor: '',
      shape: '',
      supplements: [],
      topping: '',
      packaging: '',
      deliveryOption: '',
      deliveryLocation: '',
    },
  });

  // Watch form values for price calculation
  const watchSizeFlavor = form.watch('sizeFlavor');
  const watchSupplements = form.watch('supplements') || [];
  const watchTopping = form.watch('topping');
  const watchPackaging = form.watch('packaging');
  const watchDeliveryOption = form.watch('deliveryOption');
  const watchDeliveryLocation = form.watch('deliveryLocation');

  // Calculate total price whenever relevant form fields change
  useEffect(() => {
    let price = 0;

    // Add cake base price
    if (watchSizeFlavor) {
      const [size, flavor] = watchSizeFlavor.split('_');
      if (cakeSizesAndFlavors[size] && cakeSizesAndFlavors[size][flavor]) {
        price += cakeSizesAndFlavors[size][flavor];
      }
    }

    // Add supplements price
    watchSupplements.forEach(suppId => {
      const supplement = supplements.find(s => s.id === suppId);
      if (supplement) {
        price += supplement.price;
      }
    });

    // Add topping price
    if (watchTopping) {
      const topping = toppings.find(t => t.id === watchTopping);
      if (topping) {
        price += topping.price;
      }
    }

    // Add packaging price
    if (watchPackaging) {
      const packaging = packagingOptions.find(p => p.id === watchPackaging);
      if (packaging) {
        price += packaging.price;
      }
    }

    // Add delivery price
    if (watchDeliveryOption === 'delivery' && watchDeliveryLocation) {
      const location = deliveryLocations.find(l => l.id === watchDeliveryLocation);
      if (location) {
        price += location.price;
      }
    }

    setTotalPrice(price);
  }, [watchSizeFlavor, watchSupplements, watchTopping, watchPackaging, watchDeliveryOption, watchDeliveryLocation]);

  useEffect(() => {
    loadUnavailableDates();
    loadSystemSettings();
  }, []);

  const loadUnavailableDates = async () => {
    try {
      const response = await fetch('/api/admin/dates');
      
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
      const response = await fetch('/api/admin/settings?key=custom_orders_open');
      
      if (!response.ok) {
        throw new Error('Failed to load system settings');
      }
      
      const data = await response.json();
      setCustomOrdersOpen(data?.setting_value || false);
    } catch (error) {
      console.error('Error loading system settings:', error);
    }
  };

  const handleImageUpload = (url: string) => {
    setInspirationImageUrl(url);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const minDate = addDays(today, 2); // 2 days ahead minimum
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return isBefore(date, minDate) || unavailableDates.includes(dateStr);
  };

  const onSubmit = async (data: OrderForm) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!customOrdersOpen) {
      toast.error('Custom orders are currently closed. Please try again later.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract size and flavor from combined field
      const [size, flavor] = data.sizeFlavor.split('_');
      
      // Get supplements as string
      const supplementsList = data.supplements?.map(suppId => {
        const supplement = supplements.find(s => s.id === suppId);
        return supplement?.label;
      }).filter(Boolean).join(', ');
      
      // Get topping name
      const toppingName = toppings.find(t => t.id === data.topping)?.label || '';
      
      // Get packaging name
      const packagingName = packagingOptions.find(p => p.id === data.packaging)?.label || '';
      
      // Get delivery location name
      const deliveryLocationName = deliveryLocations.find(l => l.id === data.deliveryLocation)?.label || '';
      
      // Prepare special instructions
      const specialInstructions = [
        data.cakeMessage ? `Cake Message: ${data.cakeMessage}` : '',
        supplementsList ? `Supplements: ${supplementsList}` : '',
        toppingName ? `Topping: ${toppingName}` : '',
        packagingName ? `Packaging: ${packagingName}` : '',
        data.deliveryOption === 'delivery' && deliveryLocationName ? `Delivery Location: ${deliveryLocationName}` : ''
      ].filter(Boolean).join('\n');

      await customCakes.createOrder({
        userId: user.id,
        name: data.name,
        phone: data.phone,
        email: user.email || '',
        eventDate: format(data.eventDate, 'yyyy-MM-dd'),
        size: size,
        shape: data.shape,
        flavor: flavor,
        pickupDelivery: data.deliveryOption,
        deliveryAddress: data.deliveryOption === 'delivery' ? data.location : '',
        additionalInfo: specialInstructions,
        needCandles: data.topping === 'candles',
        inspirationImageUrl: inspirationImageUrl,
        // New fields
        instagramUsername: data.instagramUsername,
        location: data.location,
        cakeMessage: data.cakeMessage || '',
        sizeFlavor: data.sizeFlavor,
        supplements: data.supplements || [],
        topping: data.topping || '',
        packaging: data.packaging || '',
        deliveryOption: data.deliveryOption,
        deliveryLocation: data.deliveryLocation || '',
        cake_type: 'Custom Cake',
      });
      
      toast.success('Custom order submitted successfully! We\'ll contact you within 24 hours to discuss your design and provide a quote.');
      form.reset();
      setInspirationImageUrl('');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!customOrdersOpen) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-8 md:p-16">
              <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-foreground/30 mx-auto mb-4 md:mb-6" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6 font-display">Custom Orders Temporarily Closed</h1>
              <p className="text-base md:text-lg text-foreground/70 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                We're currently not accepting new custom cake orders. This could be due to high demand, 
                scheduled maintenance, or holiday closures. Please check back soon or contact us for more information.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button asChild className="btn-primary w-full sm:w-auto">
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button asChild className="btn-outline w-full sm:w-auto">
                  <a href="/courses">Online Courses</a>
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
            Custom Cake Orders
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Create your perfect custom cake for any special occasion. We'll work with you to bring your vision to life.
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
                        <FormLabel className="text-foreground font-medium">Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instagramUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Instagram Username (primary contact) *</FormLabel>
                        <FormControl>
                          <Input placeholder="@yourusername" className="border-border focus:border-foreground h-12" {...field} />
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
                        <FormLabel className="text-foreground font-medium">Phone Number (secondary contact) *</FormLabel>
                        <FormControl>
                          <Input placeholder="0555 123 456" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Your Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your location" className="border-border focus:border-foreground h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Event Date */}
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground font-medium">Date you need the cake for *</FormLabel>
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
                                <span>Select a date</span>
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
                        Orders must be placed at least 2 days in advance
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cake Message */}
                <FormField
                  control={form.control}
                  name="cakeMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Cake Message (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="If you would like any writing on your cake please type the message below"
                          className="border-border focus:border-foreground min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Inspiration Images */}
                <div>
                  <Label className="text-foreground font-medium block mb-2">Cake Inspiration Images</Label>
                  <p className="text-sm text-foreground/70 mb-4">
                    Share inspiration images and color palettes - we'll create an original design in our style, not exact replicas.
                  </p>
                  <CloudinaryUpload
                    onUploadSuccess={handleImageUpload}
                    folder="inspiration-images"
                    buttonText="Upload inspiration images"
                  />
                </div>

                {/* Cake Size & Flavor Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Cake Size & Flavor</h2>
                  
                  <FormField
                    control={form.control}
                    name="sizeFlavor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Select Size and Flavor *</FormLabel>
                        <div className="space-y-6">
                          {Object.entries(cakeSizesAndFlavors).map(([size, flavors]) => (
                            <div key={size} className="space-y-2">
                              <h3 className="font-medium text-foreground">Size {size}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(flavors).map(([flavor, price]) => (
                                  <div key={`${size}_${flavor}`} className="flex items-center space-x-2">
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem 
                                          value={`${size}_${flavor}`} 
                                          id={`${size}_${flavor}`} 
                                        />
                                        <Label htmlFor={`${size}_${flavor}`} className="flex-1">
                                          {flavor} <span className="text-foreground/70">{price} da</span>
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cake Shape */}
                <FormField
                  control={form.control}
                  name="shape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Cake Shape *</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="circle" id="shape-circle" />
                              <Label htmlFor="shape-circle">Round</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="heart" id="shape-heart" />
                              <Label htmlFor="shape-heart">Heart</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="square" id="shape-square" />
                              <Label htmlFor="shape-square">Carré</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rectangle" id="shape-rectangle" />
                              <Label htmlFor="shape-rectangle">Rectangle</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Supplements */}
                <FormField
                  control={form.control}
                  name="supplements"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-foreground font-medium">Supplements (Optional)</FormLabel>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {supplements.map((supplement) => (
                          <FormItem
                            key={supplement.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(supplement.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], supplement.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== supplement.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {supplement.label} <span className="text-foreground/70">[+{supplement.price} da]</span>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Toppings/Decoration */}
                <FormField
                  control={form.control}
                  name="topping"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Toppings/Decoration (Optional)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {toppings.map((topping) => (
                          <div key={topping.id} className="flex items-center space-x-2">
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={topping.id} id={`topping-${topping.id}`} />
                                <Label htmlFor={`topping-${topping.id}`}>
                                  {topping.label} <span className="text-foreground/70">[+{topping.price} da]</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Packaging */}
                <FormField
                  control={form.control}
                  name="packaging"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Packaging (Optional)</FormLabel>
                      <div className="space-y-3">
                        {packagingOptions.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={option.id} id={`packaging-${option.id}`} />
                                <Label htmlFor={`packaging-${option.id}`}>
                                  {option.label} {option.price > 0 && <span className="text-foreground/70">[+{option.price} da]</span>}
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Delivery Options */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground font-display">Delivery Options</h2>
                  
                  <FormField
                    control={form.control}
                    name="deliveryOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">Select Delivery Option *</FormLabel>
                        <div className="space-y-3">
                          {deliveryOptions.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.id} id={`delivery-${option.id}`} />
                                  <Label htmlFor={`delivery-${option.id}`}>{option.label}</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-foreground/60 mt-2">
                          If you change your mind please let me know in advance, thanks.
                        </p>
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
                          <FormLabel className="text-foreground font-medium">Delivery Location (Constantine only) *</FormLabel>
                          <div className="space-y-3">
                            {deliveryLocations.map((location) => (
                              <div key={location.id} className="flex items-center space-x-2">
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value || ''}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={location.id} id={`location-${location.id}`} />
                                    <Label htmlFor={`location-${location.id}`}>
                                      {location.label} <span className="text-foreground/70">[{location.price} da]</span>
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Total Price */}
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-foreground font-display">Total Price:</h3>
                    <span className="text-xl font-bold text-foreground">{totalPrice} da</span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-2">
                    This is an estimate. Final price may vary based on design complexity.
                  </p>
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
                    'Submit Custom Order'
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