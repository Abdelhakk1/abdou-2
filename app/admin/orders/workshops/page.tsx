'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { workshops } from '@/lib/workshops';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminWorkshopReservations() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState('');

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
      await loadReservations();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      const reservationData = await admin.getAllWorkshopReservations();
      setReservations(reservationData);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Failed to load reservations');
    }
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    if (newStatus === 'cancelled') {
      const reservation = reservations.find(r => r.id === reservationId);
      setSelectedReservation(reservation);
      setShowCancelModal(true);
      return;
    }

    try {
      await workshops.updateReservationStatus(reservationId, newStatus as any);
      toast.success('Reservation status updated successfully');
      await loadReservations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update reservation status');
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation || !cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      await workshops.updateReservationStatus(selectedReservation.id, 'cancelled', cancellationReason);
      toast.success('Reservation cancelled successfully');
      setShowCancelModal(false);
      setSelectedReservation(null);
      setCancellationReason('');
      await loadReservations();
    } catch (error: any) {
      console.error('Error cancelling reservation:', error);
      toast.error(error.message || 'Failed to cancel reservation');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading workshop reservations...</p>
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
              <h1 className="text-4xl font-bold text-foreground">Workshop Reservations</h1>
              <p className="text-lg text-foreground/70">Manage workshop bookings and confirmations</p>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-bold text-foreground">{reservation.workshop_name}</h3>
                      {getStatusBadge(reservation.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {reservation.first_name} {reservation.last_name}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {reservation.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {reservation.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(reservation.created_at), 'PPP')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-foreground/70 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <strong>{reservation.participants}</strong> participants ({reservation.age_group})
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Soundous Bake Shop
                      </div>
                      {reservation.preferred_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Workshop: {format(new Date(reservation.preferred_date), 'PPP')}
                        </div>
                      )}
                    </div>

                    {reservation.additional_info && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground mb-2">Additional Information:</h4>
                        <p className="text-foreground/70 bg-gray-50 p-3 rounded-lg text-sm">
                          {reservation.additional_info}
                        </p>
                      </div>
                    )}

                    {reservation.cancellation_reason && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-red-600 mb-2">Cancellation Reason:</h4>
                        <p className="text-red-700 bg-red-50 p-3 rounded-lg text-sm">
                          {reservation.cancellation_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Select
                      value={reservation.status}
                      onValueChange={(value) => handleStatusUpdate(reservation.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reservations.length === 0 && (
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12">
              <Calendar className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4">No Workshop Reservations</h3>
              <p className="text-foreground/70">
                Workshop reservations will appear here when customers make bookings.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Cancel Reservation Modal */}
        {showCancelModal && selectedReservation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Cancel Reservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Workshop:</strong> {selectedReservation.workshop_name}
                  </p>
                  <p className="text-sm text-yellow-800">
                    <strong>Participant:</strong> {selectedReservation.first_name} {selectedReservation.last_name}
                  </p>
                  <p className="text-sm text-yellow-800">
                    <strong>Participants:</strong> {selectedReservation.participants}
                  </p>
                </div>
                <p className="text-foreground/70">
                  Please provide a reason for cancelling this reservation. The customer will be able to see this reason in their reservation history.
                </p>
                <Textarea
                  placeholder="Enter cancellation reason (e.g., Workshop date changed, Capacity issues, etc.)"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleCancelReservation}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    disabled={!cancellationReason.trim()}
                  >
                    Cancel Reservation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedReservation(null);
                      setCancellationReason('');
                    }}
                    className="btn-outline"
                  >
                    Keep Reservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}