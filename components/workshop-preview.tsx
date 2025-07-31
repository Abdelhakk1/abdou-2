"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Clock, 
  Users, 
  Award, 
  Calendar as CalendarIcon,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
// Removed supabase import - using API calls instead

const WorkshopPreview = () => {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workshop_schedules')
        .select('*')
        .eq('status', 'active')
        .order('date', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      setWorkshops(data || []);
    } catch (error) {
      console.error('Error loading workshops:', error);
      toast.error('Failed to load workshops');
    } finally {
      setIsLoading(false);
    }
  };

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
      <section className="section-padding bg-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline font-display">
              Hands-On Workshops
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Learn professional cake making techniques in our intimate workshop settings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden soft-shadow bg-white">
                <div className="bg-gray-200 animate-pulse h-64"></div>
                <CardContent className="p-8">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-6"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline font-display">
            Hands-On Workshops
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Learn professional cake making techniques in our intimate workshop settings
          </p>
        </div>

        {workshops.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((workshop) => {
                const availableSpots = workshop.max_participants - workshop.current_participants;
                const isFullyBooked = availableSpots <= 0;

                return (
                  <Card key={workshop.id} className="overflow-hidden soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white h-full flex flex-col">
                    <div className={`${getWorkshopTypeColor(workshop.workshop_type)} p-6`}>
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                        {workshop.image_url ? (
                          <img
                            src={workshop.image_url}
                            alt={workshop.workshop_name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                            <Award className="h-16 w-16 text-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-foreground font-display">{workshop.workshop_name}</h3>
                        {isFullyBooked && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Fully Booked
                          </span>
                        )}
                      </div>
                      
                      <p className="text-foreground/70 mb-6 leading-relaxed flex-grow">
                        {workshop.description || 'Professional cake making and decorating workshop.'}
                      </p>
                      
                      <div className="space-y-3 mb-6 text-sm text-foreground/60">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration: {calculateDuration(workshop.start_time, workshop.end_time)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Max Participants: {workshop.max_participants}
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          {availableSpots} spots remaining
                        </div>
                        <div className="text-xs text-foreground/50">
                          {format(new Date(workshop.date), 'EEEE, MMMM d, yyyy')}
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-foreground">
                              {workshop.discount_price ? workshop.discount_price.toLocaleString() : workshop.price.toLocaleString()} DA
                            </span>
                            {workshop.discount_price && (
                              <span className="text-sm text-foreground/50 line-through">
                                {workshop.price.toLocaleString()} DA
                              </span>
                            )}
                          </div>
                        </div>

                        <Button asChild className={`w-full ${isFullyBooked ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}>
                          <Link href="/workshops">
                            {isFullyBooked ? 'Fully Booked' : 'Reserve Your Spot'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button asChild className="btn-outline px-8 py-3">
                <Link href="/workshops">View All Workshops</Link>
              </Button>
            </div>
          </>
        ) : (
          /* No Workshops Available */
          <div className="text-center">
            <Card className="soft-shadow bg-white border-0 max-w-md mx-auto">
              <CardContent className="p-12">
                <Award className="h-16 w-16 text-foreground/30 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-foreground mb-4 font-display">No Workshops Scheduled</h3>
                <p className="text-foreground/70 mb-6">
                  We're currently planning our next workshop sessions. Check back soon!
                </p>
                <Button asChild className="btn-primary">
                  <Link href="/contact">Get Notified</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkshopPreview;