"use client";

import { useState, useEffect } from 'react';
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
import AuthModal from '@/components/auth/auth-modal';
import { 
  Clock, 
  Users, 
  Award, 
  Calendar as CalendarIcon,
  MapPin,
  Coffee,
  Utensils,
  CheckCircle,
  Camera,
  Heart,
  X,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { workshops } from '@/lib/workshops';

const reservationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  participants: z.string().min(1, 'Please specify number of participants'),
  ageGroup: z.enum(['adults', 'children', 'mixed'], {
    required_error: 'Please specify age group',
  }),
  additionalInfo: z.string().optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

export default function Workshops() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workshopSchedules, setWorkshopSchedules] = useState<any[]>([]);
  const [workshopGalleryItems, setWorkshopGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [workshopReservationsOpen, setWorkshopReservationsOpen] = useState(true);

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      participants: '',
      additionalInfo: '',
    },
  });

  useEffect(() => {
    loadWorkshops();
    loadSystemSettings();
    loadWorkshopGallery();
  }, []);

  const loadWorkshops = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workshops');
      
      if (!response.ok) {
        throw new Error('Failed to load workshops');
      }
      
      const data = await response.json();
      setWorkshopSchedules(data || []);
    } catch (error) {
      console.error('Error loading workshops:', error);
      toast.error('Failed to load workshops');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings?key=workshop_reservations_open');
      
      if (!response.ok) {
        throw new Error('Failed to load system settings');
      }
      
      const data = await response.json();
      setWorkshopReservationsOpen(data?.setting_value || false);
    } catch (error) {
      console.error('Error loading system settings:', error);
    }
  };

  const loadWorkshopGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error('Failed to load gallery');
      }
      
      const data = await response.json();
      const workshopItems = (data || []).filter((item: any) => item.category === 'workshops').slice(0, 6);
      setWorkshopGalleryItems(workshopItems);
    } catch (error) {
      console.error('Error loading workshop gallery:', error);
    }
  };

  const handleReserveClick = async (workshop: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!workshopReservationsOpen) {
      toast.error('Workshop reservations are currently closed. Please try again later.');
      return;
    }

    // Check if user already has a pending reservation for this workshop
    try {
      const response = await fetch(`/api/workshops/check?userId=${user.id}&workshopId=${workshop.id}`);
      
      if (response.ok) {
        const existingReservation = await response.json();
        
        if (existingReservation) {
          toast.error('You already have a pending reservation for this workshop. Please wait for admin confirmation or cancellation before submitting a new reservation.');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking existing reservation:', error);
    }

    setSelectedWorkshop(workshop);
  };

  const onSubmit = async (data: ReservationForm) => {
    if (!user || !selectedWorkshop) {
      toast.error('Please sign in to continue');
      return;
    }

    const participantCount = parseInt(data.participants);
    const availableSpots = selectedWorkshop.max_participants - selectedWorkshop.current_participants;

    if (participantCount > availableSpots) {
      toast.error(`Only ${availableSpots} spots available for this workshop`);
      return;
    }

    setIsSubmitting(true);
    try {
      await workshops.createReservation({
        userId: user.id,
        workshopId: selectedWorkshop.id,
        workshopName: selectedWorkshop.workshop_name,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        participants: participantCount,
        ageGroup: data.ageGroup,
        location: selectedWorkshop.location,
        preferredDate: selectedWorkshop.date,
        additionalInfo: data.additionalInfo,
      });
      
      toast.success('Workshop reservation submitted successfully! We\'ll contact you within 24 hours to confirm your booking.');
      form.reset();
      setSelectedWorkshop(null);
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const workshopFeatures = [
    {
      icon: Coffee,
      title: 'Breakfast Included',
      description: 'Start your day with a delicious breakfast'
    },
    {
      icon: Utensils,
      title: 'Lunch Provided',
      description: 'Enjoy a nutritious lunch during the workshop'
    },
    {
      icon: Award,
      title: 'Certificate',
      description: 'Receive a certificate of completion'
    },
    {
      icon: Camera,
      title: 'Photo Opportunities',
      description: 'Capture your creations and memories'
    }
  ];

  const getWorkshopTypeColor = (type: string) => {
    switch (type) {
      case 'pinterest':
        return 'bg-peach';
      case 'decorating':
        return 'bg-lavender';
      case 'complete':
        return 'bg-mint';
      default:
        return 'bg-primary';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMinutes === 0) {
      return `${diffHours} hours`;
    }
    return `${diffHours}h ${diffMinutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (!workshopReservationsOpen) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-16">
              <AlertCircle className="h-16 w-16 text-foreground/30 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-6">Workshop Reservations Temporarily Closed</h1>
              <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                We're currently not accepting new workshop reservations. This could be due to high demand, 
                scheduled maintenance, or holiday closures. Please check back soon or contact us for more information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-primary">
                  <a href="/contact">Contact Us</a>
                </Button>
                <Button asChild className="btn-outline">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline">
            Hands-On Workshops
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Learn professional cake making techniques in our intimate workshop settings
          </p>
          <div className="flex items-center justify-center mt-6 text-foreground/70">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Constantine, Algeria</span>
          </div>
        </div>

        {/* Workshop Cards */}
        {workshopSchedules.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {workshopSchedules.map((workshop) => {
              const availableSpots = workshop.max_participants - workshop.current_participants;
              const isFullyBooked = availableSpots <= 0;

              return (
                <Card key={workshop.id} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
                  <div className={`${getWorkshopTypeColor(workshop.workshop_type)} p-8`}>
                    <div className="w-full h-64 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                      {workshop.image_url ? (
                        <img
                          src={workshop.image_url}
                          alt={workshop.workshop_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Award className="h-16 w-16 text-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground capitalize">
                            {workshop.workshop_type} Workshop
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-2xl font-bold text-foreground">{workshop.workshop_name}</CardTitle>
                      <div className="flex space-x-2">
                        {workshop.discount_price && (
                          <Badge className="bg-red-500 text-white">
                            {Math.round(((workshop.price - workshop.discount_price) / workshop.price) * 100)}% OFF
                          </Badge>
                        )}
                        {isFullyBooked && (
                          <Badge className="bg-red-500 text-white">
                            Fully Booked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">
                      {workshop.description || 'Professional cake making and decorating workshop.'}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Workshop Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-foreground/70">
                        <Clock className="h-4 w-4 mr-2" />
                        {calculateDuration(workshop.start_time, workshop.end_time)}
                      </div>
                      <div className="flex items-center text-sm text-foreground/70">
                        <Users className="h-4 w-4 mr-2" />
                        {availableSpots} spots remaining
                      </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-foreground" />
                          <span className="font-semibold text-foreground">
                            {format(new Date(workshop.date), 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                        <div className="text-sm text-foreground/70">
                          {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-foreground/70">
                          <MapPin className="h-4 w-4 mr-2" />
                          {workshop.location}
                        </div>
                        <div className="text-sm text-foreground/70">
                          {workshop.current_participants}/{workshop.max_participants} registered
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {workshop.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">{workshop.notes}</p>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-foreground">
                            {workshop.discount_price ? workshop.discount_price.toLocaleString() : workshop.price.toLocaleString()} DA
                          </span>
                          {workshop.discount_price && (
                            <span className="text-lg text-foreground/50 line-through">
                              {workshop.price.toLocaleString()} DA
                            </span>
                          )}
                        </div>
                        {workshop.discount_price && (
                          <p className="text-xs text-foreground/60">Limited time offer</p>
                        )}
                      </div>
                      <Button 
                        className="btn-primary"
                        onClick={() => handleReserveClick(workshop)}
                        disabled={isFullyBooked}
                      >
                        {isFullyBooked ? 'Fully Booked' : 'Reserve Your Spot'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card className="soft-shadow bg-white border-0 text-center mb-16">
            <CardContent className="p-16">
              <CalendarIcon className="h-16 w-16 text-foreground/30 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-4">No Workshops Scheduled</h3>
              <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                We're currently planning our next workshop sessions. Check back soon or contact us to be notified when new workshops are available.
              </p>
              <Button asChild className="btn-primary">
                <a href="/contact">Get Notified</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Workshop Features - Only show if there are workshops */}
        {workshopSchedules.length > 0 && (
          <Card className="soft-shadow bg-pink border-0 mb-16">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12 custom-underline">
                What's Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {workshopFeatures.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-foreground/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workshop Gallery - Only show if there are workshops and gallery items */}
        {workshopSchedules.length > 0 && workshopGalleryItems.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12 custom-underline">
              Workshop Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workshopGalleryItems.map((item) => (
                <div key={item.id} className="relative group overflow-hidden rounded-lg soft-shadow hover:elegant-shadow hover-lift transition-all duration-300">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-semibold">{item.title}</h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <Card className="soft-shadow bg-primary/10 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Questions About Our Workshops?
            </h2>
            <p className="text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're here to help! Contact us for more information about our workshops, 
              upcoming dates, or to discuss custom workshop options for groups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary">
                <a href="/contact">Contact Us</a>
              </Button>
              <Button asChild className="btn-outline">
                <a href="tel:+213555123456">Call: +213 555 123 456</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />

        {/* Registration Form Modal */}
        {selectedWorkshop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-foreground">
                  Reserve Your Spot - {selectedWorkshop.workshop_name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedWorkshop(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Workshop Details */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Workshop Details</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Date:</strong> {format(new Date(selectedWorkshop.date), 'EEEE, MMMM d, yyyy')}</p>
                    <p><strong>Time:</strong> {formatTime(selectedWorkshop.start_time)} - {formatTime(selectedWorkshop.end_time)}</p>
                    <p><strong>Location:</strong> {selectedWorkshop.location}</p>
                    <p><strong>Available Spots:</strong> {selectedWorkshop.max_participants - selectedWorkshop.current_participants}</p>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Phone *</FormLabel>
                            <FormControl>
                              <Input placeholder="0555 123 456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Email *</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">How many participants? *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ageGroup"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-foreground font-medium">Age Group *</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="children" id="children" />
                                  <Label htmlFor="children">Children</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="adults" id="adults" />
                                  <Label htmlFor="adults">Adults</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="mixed" id="mixed" />
                                  <Label htmlFor="mixed">Mixed</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">Any additional info you'd like us to know?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Special requirements, dietary restrictions, or any other information..."
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Loading...' : 'Submit'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setSelectedWorkshop(null)}
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