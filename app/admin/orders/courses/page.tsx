'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ArrowLeft,
  Eye,
  X,
  FileText,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminCourseOrders() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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
      const orderData = await admin.getAllCourseOrders();
      setOrders(orderData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    }
  };

  const handleVerifyPayment = async (receiptId: string) => {
    setIsVerifying(true);
    try {
      await admin.verifyPayment(receiptId);
      toast.success('Payment verified and course access granted!');
      await loadOrders();
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast.error(error.message || 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      // Update order status using admin client
      const { data, error } = await admin.updateCourseOrderStatus(orderId, newStatus as any);
      
      if (error) throw error;
      
      toast.success('Order status updated successfully');
      await loadOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Payment', icon: Clock },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Payment Submitted', icon: AlertCircle },
      verified: { color: 'bg-green-100 text-green-800', label: 'Verified', icon: CheckCircle },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'paid':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading course orders...</p>
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
              <h1 className="text-4xl font-bold text-foreground">Course Orders</h1>
              <p className="text-lg text-foreground/70">Manage course purchases and payment verification</p>
            </div>
          </div>
        </div>

        {/* Status Explanation */}
        <Card className="soft-shadow bg-blue-50 border-blue-200 mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Order Status Guide:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-blue-800"><strong>Pending:</strong> Order placed, waiting for payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800"><strong>Paid:</strong> Receipt uploaded, needs verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-blue-800"><strong>Verified:</strong> Payment confirmed, access granted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{order.course_name}</h3>
                        <p className="text-foreground/70">
                          Ordered on {format(new Date(order.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {order.users?.full_name || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {order.users?.email || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {order.users?.phone || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(order.created_at), 'PPP')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-foreground/50" />
                          <span className="font-semibold text-foreground">
                            {order.amount.toLocaleString()} DA
                          </span>
                        </div>
                        <div className="text-sm text-foreground/70">
                          Payment: {order.payment_method === 'baridimob' ? 'BaridiMob' : 'CCP Bank Transfer'}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(order.status)}
                        
                        {/* Status Update Dropdown */}
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          disabled={isUpdatingStatus}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {order.status === 'paid' && order.payment_receipts?.length > 0 && (
                      <Button
                        size="sm"
                        className="btn-primary"
                        onClick={() => handleVerifyPayment(order.payment_receipts[0].id)}
                        disabled={isVerifying}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isVerifying ? 'Verifying...' : 'Verify Payment'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Payment Receipts */}
                {order.payment_receipts && order.payment_receipts.length > 0 && (
                  <div className="border-t border-foreground/10 pt-4">
                    <h4 className="font-semibold text-foreground mb-3">Payment Receipts</h4>
                    <div className="space-y-3">
                      {order.payment_receipts.map((receipt: any) => (
                        <div key={receipt.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Amount:</span> {receipt.amount}
                            </div>
                            <div>
                              <span className="font-medium">Status:</span> 
                              <Badge className={`ml-2 ${receipt.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {receipt.verified ? 'Verified' : 'Pending'}
                              </Badge>
                            </div>
                          </div>
                          {receipt.notes && (
                            <div className="mt-2 text-sm text-foreground/70">
                              <span className="font-medium">Notes:</span> {receipt.notes}
                            </div>
                          )}
                          <div className="mt-3 flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReceipt(receipt)}
                              className="btn-outline"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Receipt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="btn-outline"
                            >
                              <a 
                                href={receipt.receipt_url} 
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4">No Course Orders</h3>
              <p className="text-foreground/70">
                Course orders will appear here when customers make purchases.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Receipt Viewing Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Payment Receipt</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedReceipt(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Amount:</span> {selectedReceipt.amount}
                    </div>
                    <div>
                      <span className="font-medium">Uploaded:</span> {format(new Date(selectedReceipt.created_at), 'PPP')}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${selectedReceipt.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {selectedReceipt.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  {selectedReceipt.notes && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Notes:</span> {selectedReceipt.notes}
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-4 text-center">
                    <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-4">Receipt Document</p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        asChild
                        className="btn-primary"
                      >
                        <a 
                          href={selectedReceipt.receipt_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open in New Tab
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="btn-outline"
                      >
                        <a 
                          href={selectedReceipt.receipt_url} 
                          download
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Try to display the image if it's an image file */}
                  {selectedReceipt.receipt_url && (
                    <div className="p-4">
                      <img
                        src={selectedReceipt.receipt_url}
                        alt="Payment Receipt"
                        className="w-full max-h-96 object-contain mx-auto"
                        onError={(e) => {
                          // Hide image if it fails to load (e.g., if it's a PDF)
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}