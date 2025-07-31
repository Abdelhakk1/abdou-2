'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { customCakes } from '@/lib/custom-cakes';
import { User, Mail, Phone, Calendar, Cake, Users, MapPin, ArrowLeft, CheckCircle, Clock, AlertCircle, Image as ImageIcon, X, Eye, Download, Truck, Package, Candy as Candle, Heart, Circle, Square, Instagram } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminCakeOrders() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
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
      await loadOrders();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const orderData = await admin.getAllCustomCakeOrders();
      setOrders(orderData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (newStatus === 'cancelled') {
      const order = orders.find(o => o.id === orderId);
      setSelectedOrder(order);
      setShowCancelModal(true);
      return;
    }

    try {
      const updatedOrder = await customCakes.updateOrderStatus(orderId, newStatus as any);
      if (updatedOrder) {
        toast.success('Order status updated successfully');
        await loadOrders();
      } else {
        toast.error('Order not found or could not be updated');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      await customCakes.updateOrderStatus(selectedOrder.id, 'cancelled', cancellationReason);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancellationReason('');
      await loadOrders();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed', icon: CheckCircle },
      in_progress: { color: 'bg-purple-100 text-purple-800', label: 'In Progress', icon: AlertCircle },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: CheckCircle },
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

  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case 'heart':
        return <Heart className="h-4 w-4 mr-2" />;
      case 'circle':
        return <Circle className="h-4 w-4 mr-2" />;
      case 'square':
        return <Square className="h-4 w-4 mr-2" />;
      case 'rectangle':
        return <Square className="h-4 w-4 mr-2" />;
      default:
        return <Square className="h-4 w-4 mr-2" />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading cake orders...</p>
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
              <h1 className="text-4xl font-bold text-foreground">Custom Cake Orders</h1>
              <p className="text-lg text-foreground/70">Manage custom cake requests and orders</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-bold text-foreground">{order.cake_type || `${order.size} ${order.shape} cake`}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    {/* Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70 mb-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {order.name}
                      </div>
                      <div className="flex items-center">
                        <Instagram className="h-4 w-4 mr-2" />
                        {order.instagram_username || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {order.phone}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Event: {format(new Date(order.event_date), 'PPP')}
                      </div>
                    </div>

                    {/* Cake Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Cake Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70">
                        <div className="flex items-center">
                          <Cake className="h-4 w-4 mr-2" />
                          {order.size_flavor ? 
                            `Size/Flavor: ${order.size_flavor.replace('_', ' ')}` : 
                            `Flavor: ${order.flavor}`
                          }
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Size: {order.size || `${order.servings} servings`}
                        </div>
                        <div className="flex items-center">
                          {getShapeIcon(order.shape)}
                          Shape: {order.shape ? order.shape.charAt(0).toUpperCase() + order.shape.slice(1) : 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <Candle className="h-4 w-4 mr-2" />
                          Candles: {order.need_candles ? 'Yes' : 'No'}
                        </div>
                      </div>
                      
                      {/* New fields */}
                      {(order.supplements && order.supplements.length > 0) && (
                        <div className="mt-3">
                          <h5 className="font-medium text-foreground mb-1">Supplements:</h5>
                          <p className="text-foreground/70">{order.supplements.join(', ')}</p>
                        </div>
                      )}
                      
                      {order.topping && (
                        <div className="mt-3">
                          <h5 className="font-medium text-foreground mb-1">Topping:</h5>
                          <p className="text-foreground/70">{order.topping}</p>
                        </div>
                      )}
                      
                      {order.packaging && (
                        <div className="mt-3">
                          <h5 className="font-medium text-foreground mb-1">Packaging:</h5>
                          <p className="text-foreground/70">{order.packaging}</p>
                        </div>
                      )}
                      
                      {order.cake_message && (
                        <div className="mt-3">
                          <h5 className="font-medium text-foreground mb-1">Cake Message:</h5>
                          <p className="text-foreground/70">{order.cake_message}</p>
                        </div>
                      )}
                    </div>

                    {/* Pickup/Delivery Information */}
                    {order.pickup_delivery && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-foreground mb-3">
                          {order.pickup_delivery === 'delivery' ? 'Delivery' : 'Pickup'} Information
                        </h4>
                        <div className="space-y-2 text-sm text-foreground/70">
                          <div className="flex items-center">
                            {order.delivery_option === 'delivery' ? (
                              <Truck className="h-4 w-4 mr-2" />
                            ) : (
                              <Package className="h-4 w-4 mr-2" />
                            )}
                            Method: {order.delivery_option === 'delivery' ? 'Delivery' : 'Pickup'}
                          </div>
                          
                          {order.delivery_option === 'delivery' && order.delivery_location && (
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                              <div>
                                <span className="font-medium">Delivery Location:</span>
                                <div className="mt-1">{order.delivery_location}</div>
                              </div>
                            </div>
                          )}
                          
                          {order.location && (
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                              <div>
                                <span className="font-medium">Customer Location:</span>
                                <div className="mt-1">{order.location}</div>
                              </div>
                            </div>
                          )}
                          
                          {order.pickup_delivery === 'delivery' && order.delivery_time && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Preferred delivery time: {order.delivery_time}
                            </div>
                          )}
                          
                          {order.pickup_delivery === 'pickup' && order.pickup_time && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Preferred pickup time: {order.pickup_time}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-foreground/70 mb-6">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Ordered: {format(new Date(order.created_at), 'PPP')}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Event Date: {format(new Date(order.event_date), 'PPP')}
                      </div>
                    </div>

                    {/* Inspiration Image */}
                    {order.inspiration_image_url && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Inspiration Image:</h4>
                        <div className="relative inline-block group">
                          <img
                            src={order.inspiration_image_url}
                            alt="Customer inspiration"
                            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-md"
                            onClick={() => setSelectedImage(order.inspiration_image_url)}
                            onError={(e) => {
                              console.error('Error loading image:', order.inspiration_image_url);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:text-white hover:bg-white/20"
                              onClick={() => setSelectedImage(order.inspiration_image_url)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedImage(order.inspiration_image_url)}
                            className="btn-outline text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Full Size
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="btn-outline text-xs"
                          >
                            <a 
                              href={order.inspiration_image_url} 
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Special Instructions */}
                    {order.special_instructions && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground mb-2">Special Instructions:</h4>
                        <p className="text-foreground/70 bg-gray-50 p-3 rounded-lg text-sm">
                          {order.special_instructions}
                        </p>
                      </div>
                    )}

                    {/* Cancellation Reason */}
                    {order.cancellation_reason && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-red-600 mb-2">Cancellation Reason:</h4>
                        <p className="text-red-700 bg-red-50 p-3 rounded-lg text-sm">
                          {order.cancellation_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12">
              <Cake className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4">No Cake Orders</h3>
              <p className="text-foreground/70">
                Custom cake orders will appear here when customers place orders.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={selectedImage}
                alt="Inspiration"
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  console.error('Error loading full-size image:', selectedImage);
                  toast.error('Failed to load image');
                  setSelectedImage(null);
                }}
              />
              <div 
                className="absolute inset-0 -z-10" 
                onClick={() => setSelectedImage(null)}
              />
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Cancel Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Order:</strong> {selectedOrder.cake_type} for {selectedOrder.name}
                  </p>
                  <p className="text-sm text-yellow-800">
                    <strong>Event Date:</strong> {format(new Date(selectedOrder.event_date), 'PPP')}
                  </p>
                </div>
                <p className="text-foreground/70">
                  Please provide a reason for cancelling this order. The customer will be able to see this reason in their order history.
                </p>
                <Textarea
                  placeholder="Enter cancellation reason (e.g., Unable to fulfill due to scheduling conflict, Ingredient unavailability, etc.)"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleCancelOrder}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    disabled={!cancellationReason.trim()}
                  >
                    Cancel Order
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedOrder(null);
                      setCancellationReason('');
                    }}
                    className="btn-outline"
                  >
                    Keep Order
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