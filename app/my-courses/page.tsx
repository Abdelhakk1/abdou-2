"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { courses } from '@/lib/courses';
import { customCakes } from '@/lib/custom-cakes';
import { workshops } from '@/lib/workshops';
import AuthModal from '@/components/auth/auth-modal';
import { 
  BookOpen, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  Cake,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { format } from 'date-fns';

export default function MyCourses() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [courseAccess, setCourseAccess] = useState<any[]>([]);
  const [cakeOrders, setCakeOrders] = useState<any[]>([]);
  const [workshopReservations, setWorkshopReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [ordersData, accessData, cakeOrdersData, workshopData] = await Promise.all([
        courses.getUserOrders(user.id),
        courses.getUserCourseAccess(user.id),
        customCakes.getUserOrders(user.id),
        workshops.getUserReservations(user.id),
      ]);
      
      setUserOrders(ordersData || []);
      setCourseAccess(accessData || []);
      setCakeOrders(cakeOrdersData || []);
      setWorkshopReservations(workshopData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment' },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Payment Submitted' },
      verified: { color: 'bg-green-100 text-green-800', label: 'Verified' },
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      in_progress: { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'paid':
      case 'confirmed':
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
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
              <BookOpen className="h-12 w-12 text-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Access Your Dashboard</h2>
              <p className="text-foreground/70 mb-6">
                Please sign in to view your orders, courses, and reservations.
              </p>
              <Button 
                className="btn-primary w-full"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In to Continue
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline">
            My Dashboard
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Manage your orders, courses, and workshop reservations all in one place
          </p>
        </div>

        <Tabs defaultValue="courses" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Online Courses</TabsTrigger>
            <TabsTrigger value="cakes">Cake Orders</TabsTrigger>
            <TabsTrigger value="workshops">Workshop Reservations</TabsTrigger>
            <TabsTrigger value="access">Course Access</TabsTrigger>
          </TabsList>

          {/* Online Courses Tab */}
          <TabsContent value="courses">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Online Courses</h2>
              
              {userOrders.length === 0 ? (
                <Card className="soft-shadow bg-white border-0 text-center">
                  <CardContent className="p-12">
                    <BookOpen className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-4">No Course Orders</h3>
                    <p className="text-foreground/70 mb-6">
                      You haven't purchased any courses yet. Explore our available courses and start your learning journey!
                    </p>
                    <Button asChild className="btn-primary">
                      <a href="/courses">Explore Courses</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order) => (
                    <Card key={order.id} className="soft-shadow bg-white border-0">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{order.course_name}</h3>
                              <p className="text-foreground/70">
                                Ordered on {format(new Date(order.created_at), 'PPP')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-lg font-bold text-foreground mt-2">
                              {order.amount.toLocaleString()} DA
                            </p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center mb-4">
                          <FileText className="h-4 w-4 mr-2 text-foreground/50" />
                          <span className="text-sm text-foreground/70">
                            Payment Method: {order.payment_method === 'baridimob' ? 'BaridiMob' : 'CCP Bank Transfer'}
                          </span>
                        </div>

                        {/* Status Messages */}
                        {order.status === 'pending' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                              ⏳ Waiting for payment. Please complete your payment and upload the receipt.
                            </p>
                          </div>
                        )}

                        {order.status === 'paid' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                              📋 Payment receipt received. We're verifying your payment and will grant access soon.
                            </p>
                          </div>
                        )}

                        {order.status === 'verified' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                              ✅ Payment verified! Course access has been granted. Check the "Course Access" tab.
                            </p>
                          </div>
                        )}

                        {order.status === 'cancelled' && order.cancellation_reason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-2">Order Cancelled</h4>
                            <p className="text-sm text-red-700">
                              <strong>Reason:</strong> {order.cancellation_reason}
                            </p>
                          </div>
                        )}

                        {/* Receipt Information */}
                        {order.payment_receipts && order.payment_receipts.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-foreground/10">
                            <h4 className="font-semibold text-foreground mb-2">Payment Receipt</h4>
                            {order.payment_receipts.map((receipt: any) => (
                              <div key={receipt.id} className="text-sm text-foreground/70">
                                <p>Transaction: {receipt.transaction_number}</p>
                                <p>Amount: {receipt.amount}</p>
                                {receipt.notes && <p>Notes: {receipt.notes}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Cake Orders Tab */}
          <TabsContent value="cakes">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Cake Orders</h2>
              
              {cakeOrders.length === 0 ? (
                <Card className="soft-shadow bg-white border-0 text-center">
                  <CardContent className="p-12">
                    <Cake className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-4">No Cake Orders</h3>
                    <p className="text-foreground/70 mb-6">
                      You haven't ordered any custom cakes yet. Create your perfect cake for your next celebration!
                    </p>
                    <Button asChild className="btn-primary">
                      <a href="/custom">Order Custom Cake</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {cakeOrders.map((order) => (
                    <Card key={order.id} className="soft-shadow bg-white border-0">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{order.cake_type} - {order.flavor}</h3>
                              <p className="text-foreground/70">
                                Event Date: {format(new Date(order.event_date), 'PPP')}
                              </p>
                              <p className="text-foreground/70 text-sm">
                                Ordered on {format(new Date(order.created_at), 'PPP')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-sm text-foreground/70 mt-2">
                              Servings: {order.servings}
                            </p>
                          </div>
                        </div>

                        {order.special_instructions && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-foreground mb-2">Special Instructions:</h4>
                            <p className="text-foreground/70 bg-gray-50 p-3 rounded-lg text-sm">
                              {order.special_instructions}
                            </p>
                          </div>
                        )}

                        {order.status === 'cancelled' && order.cancellation_reason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-red-800 mb-2">Order Cancelled</h4>
                                <p className="text-sm text-red-700">
                                  <strong>Reason:</strong> {order.cancellation_reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Workshop Reservations Tab */}
          <TabsContent value="workshops">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Workshop Reservations</h2>
              
              {workshopReservations.length === 0 ? (
                <Card className="soft-shadow bg-white border-0 text-center">
                  <CardContent className="p-12">
                    <Users className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-4">No Workshop Reservations</h3>
                    <p className="text-foreground/70 mb-6">
                      You haven't reserved any workshops yet. Join our hands-on workshops to learn amazing techniques!
                    </p>
                    <Button asChild className="btn-primary">
                      <a href="/workshops">Hands-On Workshops</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {workshopReservations.map((reservation) => (
                    <Card key={reservation.id} className="soft-shadow bg-white border-0">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(reservation.status)}
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{reservation.workshop_name}</h3>
                              <p className="text-foreground/70">
                                {reservation.participants} participants ({reservation.age_group})
                              </p>
                              <p className="text-foreground/70 text-sm">
                                Reserved on {format(new Date(reservation.created_at), 'PPP')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(reservation.status)}
                            <p className="text-sm text-foreground/70 mt-2">
                              Location: {reservation.location === 'shop' ? 'Bake Shop' : 'Custom'}
                            </p>
                          </div>
                        </div>

                        {reservation.preferred_date && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-foreground mb-2">Preferred Date:</h4>
                            <p className="text-foreground/70">
                              {format(new Date(reservation.preferred_date), 'PPP')}
                            </p>
                          </div>
                        )}

                        {reservation.status === 'cancelled' && reservation.cancellation_reason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-2">Reservation Cancelled</h4>
                            <p className="text-sm text-red-700">
                              <strong>Reason:</strong> {reservation.cancellation_reason}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Course Access Tab */}
          <TabsContent value="access">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Course Access</h2>
              
              {courseAccess.length === 0 ? (
                <Card className="soft-shadow bg-white border-0 text-center">
                  <CardContent className="p-12">
                    <BookOpen className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-4">No Course Access</h3>
                    <p className="text-foreground/70 mb-6">
                      You don't have access to any courses yet. Purchase a course to start learning!
                    </p>
                    <Button asChild className="btn-primary">
                      <a href="/courses">Explore Courses</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courseAccess.map((access) => (
                    <Card key={access.id} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <CardTitle className="text-xl font-bold text-foreground">{access.course_name}</CardTitle>
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-foreground/70">
                          <Calendar className="h-4 w-4 mr-2" />
                          Access granted: {format(new Date(access.granted_at), 'PPP')}
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-800 mb-3">
                            🎉 Congratulations! You now have access to this course.
                          </p>
                          <Button 
                            asChild 
                            className="w-full btn-primary"
                          >
                            <a 
                              href={access.google_drive_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Start Learning
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="soft-shadow bg-primary/10 border-0 mt-16">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Need Help?
            </h2>
            <p className="text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              If you have any questions about your orders, payments, or course access, 
              we're here to help! Contact us and we'll get back to you quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary">
                <a href="/contact">Contact Support</a>
              </Button>
              <Button asChild className="btn-outline">
                <a href="tel:+213555123456">Call: +213 555 123 456</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}