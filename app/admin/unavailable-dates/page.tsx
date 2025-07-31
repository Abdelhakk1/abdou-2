'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminUnavailableDates() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      checkAdminAccess();
    }
  }, [user, loading, router]);

  const checkAdminAccess = async () => {
    try {
      const adminUser = await admin.isAdmin(user!.id);
      if (!adminUser) {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      await loadUnavailableDates();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnavailableDates = async () => {
    try {
      const dates = await admin.getUnavailableDates();
      setUnavailableDates(dates);
    } catch (error) {
      console.error('Error loading unavailable dates:', error);
      toast.error('Failed to load unavailable dates');
    }
  };

  const handleAddDate = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsSubmitting(true);
    try {
      await admin.addUnavailableDate({
        date: format(selectedDate, 'yyyy-MM-dd'),
        reason: reason.trim() || 'Unavailable',
      });
      
      toast.success('Date marked as unavailable');
      setSelectedDate(undefined);
      setReason('');
      await loadUnavailableDates();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add unavailable date');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveDate = async (id: string) => {
    if (!confirm('Are you sure you want to remove this unavailable date?')) return;

    try {
      await admin.removeUnavailableDate(id);
      toast.success('Unavailable date removed');
      await loadUnavailableDates();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove unavailable date');
    }
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableDates.some(ud => ud.date === dateStr);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading unavailable dates...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Unavailable Dates</h1>
              <p className="text-lg text-foreground/70">Manage dates when custom cake orders cannot be fulfilled</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendar and Add Date */}
          <div className="space-y-8">
            <Card className="soft-shadow bg-white border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Mark Date as Unavailable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Select Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || isDateUnavailable(date)}
                    className="rounded-md border"
                  />
                  <p className="text-xs text-foreground/60 mt-2">
                    Red dates are already marked as unavailable
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Reason (Optional)
                  </label>
                  <Textarea
                    placeholder="e.g., Holiday, Personal leave, Equipment maintenance..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  onClick={handleAddDate}
                  className="w-full btn-primary"
                  disabled={!selectedDate || isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Adding...' : 'Mark as Unavailable'}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="soft-shadow bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Dates marked here will be unavailable for new custom cake orders</li>
                      <li>• Customers will see these dates as disabled in the order calendar</li>
                      <li>• Dates with existing confirmed orders are automatically unavailable</li>
                      <li>• You can remove manually added dates anytime</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unavailable Dates List */}
          <div>
            <Card className="soft-shadow bg-white border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Current Unavailable Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unavailableDates.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Unavailable Dates</h3>
                    <p className="text-foreground/70">
                      All dates are currently available for custom cake orders.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {unavailableDates
                      .filter(date => date.type === 'manual') // Only show manually added dates (admin can remove these)
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((unavailableDate) => (
                        <div 
                          key={unavailableDate.id || unavailableDate.date} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">
                              {format(new Date(unavailableDate.date), 'EEEE, MMMM d, yyyy')}
                            </div>
                            {unavailableDate.reason && (
                              <div className="text-sm text-foreground/70 mt-1">
                                {unavailableDate.reason}
                              </div>
                            )}
                            <div className="text-xs text-foreground/50 mt-1">
                              Manually added
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveDate(unavailableDate.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    
                    {/* Show booked dates (read-only) */}
                    {unavailableDates
                      .filter(date => date.type === 'booked')
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((unavailableDate) => (
                        <div 
                          key={unavailableDate.date} 
                          className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">
                              {format(new Date(unavailableDate.date), 'EEEE, MMMM d, yyyy')}
                            </div>
                            <div className="text-sm text-foreground/70 mt-1">
                              {unavailableDate.reason}
                            </div>
                            <div className="text-xs text-foreground/50 mt-1">
                              Automatically blocked (existing order)
                            </div>
                          </div>
                          <div className="text-xs text-foreground/50">
                            Auto-blocked
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}