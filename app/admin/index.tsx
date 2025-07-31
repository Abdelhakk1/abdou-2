'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { contact } from '@/lib/contact';
import { toast } from 'sonner';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Calendar, 
  Image, 
  BookOpen,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  CalendarX,
  Settings,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Cake
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const adminStatus = await admin.isAdmin(user!.id);
      if (!adminStatus) {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      loadDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    }
  };

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, settings, contactMessages] = await Promise.all([
        admin.getDashboardStats(),
        admin.getSystemSettings(),
        contact.getAllMessages()
      ]);
      
      // Add contact messages stats to dashboard stats
      const unreadMessages = contactMessages?.filter(m => m.status === 'unread').length || 0;
      const totalMessages = contactMessages?.length || 0;
      
      setStats({
        ...dashboardStats,
        totalContactMessages: totalMessages,
        unreadContactMessages: unreadMessages,
      });
      setSystemSettings(settings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoading(false);
    }
  };

  const handleSystemSettingToggle = async (settingKey: string, currentValue: boolean) => {
    try {
      await admin.updateSystemSetting(settingKey, !currentValue);
      toast.success('Setting updated successfully');
      await loadDashboardData(); // Refresh settings
    } catch (error: any) {
      toast.error(error.message || 'Failed to update setting');
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

  if (!isAdmin) {
    return null;
  }

  const quickActions = [
    {
      title: 'Manage Gallery',
      description: 'Add, edit, and organize gallery images',
      icon: Image,
      href: '/admin/gallery',
      color: 'bg-blue-500'
    },
    {
      title: 'Workshop Schedules',
      description: 'Manage workshop dates and availability',
      icon: Calendar,
      href: '/admin/workshops',
      color: 'bg-green-500'
    },
    {
      title: 'Online Courses',
      description: 'Create and manage online courses',
      icon: BookOpen,
      href: '/admin/courses',
      color: 'bg-purple-500'
    },
    {
      title: 'Course Orders',
      description: 'Manage course purchases and payments',
      icon: ShoppingCart,
      href: '/admin/orders/courses',
      color: 'bg-orange-500'
    },
    {
      title: 'Cake Orders',
      description: 'Manage custom cake orders',
      icon: Users,
      href: '/admin/orders/cakes',
      color: 'bg-pink-500'
    },
    {
      title: 'Wedding Cake Orders',
      description: 'Manage wedding cake orders',
      icon: Cake,
      href: '/admin/orders/wedding',
      color: 'bg-red-500'
    },
    {
      title: 'Workshop Reservations',
      description: 'Manage workshop bookings',
      icon: Calendar,
      href: '/admin/orders/workshops',
      color: 'bg-indigo-500'
    },
    {
      title: 'Contact Messages',
      description: 'View and respond to customer inquiries',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-teal-500'
    },
    {
      title: 'Unavailable Dates',
      description: 'Manage dates when orders cannot be fulfilled',
      icon: CalendarX,
      href: '/admin/unavailable-dates',
      color: 'bg-red-500'
    }
  ];

  const customOrdersSetting = systemSettings.find(s => s.setting_key === 'custom_orders_open');
  const workshopReservationsSetting = systemSettings.find(s => s.setting_key === 'workshop_reservations_open');
  const weddingOrdersSetting = systemSettings.find(s => s.setting_key === 'wedding_orders_open');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-lg text-foreground/70">
            Welcome to your admin dashboard. Manage your content, orders, and settings here.
          </p>
        </div>

        {/* System Controls */}
        <Card className="soft-shadow bg-white border-0 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center">
              <Settings className="h-6 w-6 mr-3" />
              System Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Custom Cake Orders</h3>
                  <p className="text-sm text-foreground/70">
                    {customOrdersSetting?.setting_value ? 'Currently accepting orders' : 'Orders currently closed'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {customOrdersSetting?.setting_value ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-red-600" />
                  )}
                  <Switch
                    checked={customOrdersSetting?.setting_value || false}
                    onCheckedChange={() => handleSystemSettingToggle('custom_orders_open', customOrdersSetting?.setting_value || false)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Wedding Cake Orders</h3>
                  <p className="text-sm text-foreground/70">
                    {weddingOrdersSetting?.setting_value ? 'Currently accepting orders' : 'Orders currently closed'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {weddingOrdersSetting?.setting_value ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-red-600" />
                  )}
                  <Switch
                    checked={weddingOrdersSetting?.setting_value || false}
                    onCheckedChange={() => handleSystemSettingToggle('wedding_orders_open', weddingOrdersSetting?.setting_value || false)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Workshop Reservations</h3>
                  <p className="text-sm text-foreground/70">
                    {workshopReservationsSetting?.setting_value ? 'Currently accepting reservations' : 'Reservations currently closed'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {workshopReservationsSetting?.setting_value ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-red-600" />
                  )}
                  <Switch
                    checked={workshopReservationsSetting?.setting_value || false}
                    onCheckedChange={() => handleSystemSettingToggle('workshop_reservations_open', workshopReservationsSetting?.setting_value || false)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <Card className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Course Orders</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalCourseOrders}</p>
                    {stats.pendingCourseOrders > 0 && (
                      <p className="text-sm text-orange-600">
                        {stats.pendingCourseOrders} pending
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Cake Orders</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalCakeOrders}</p>
                    {stats.pendingCakeOrders > 0 && (
                      <p className="text-sm text-orange-600">
                        {stats.pendingCakeOrders} pending
                      </p>
                    )}
                  </div>
                  <div className="bg-pink-100 rounded-full p-3">
                    <ShoppingCart className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Workshop Reservations</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalWorkshopReservations}</p>
                    {stats.pendingWorkshopReservations > 0 && (
                      <p className="text-sm text-orange-600">
                        {stats.pendingWorkshopReservations} pending
                      </p>
                    )}
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Contact Messages</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalContactMessages}</p>
                    {stats.unreadContactMessages > 0 && (
                      <p className="text-sm text-orange-600">
                        {stats.unreadContactMessages} unread
                      </p>
                    )}
                  </div>
                  <div className="bg-teal-100 rounded-full p-3">
                    <MessageSquare className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Gallery Items</p>
                    <p className="text-2xl font-bold text-foreground">{stats?.totalGalleryItems || 0}</p>
                    <p className="text-sm text-green-600">Active</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <Image className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
                <CardContent className="p-6">
                  <Link 
                    href={action.href} 
                    className="block"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${action.color} rounded-lg p-3`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                        <p className="text-sm text-foreground/70">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="soft-shadow bg-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.pendingCourseOrders > 0 && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-sm font-medium">Course orders awaiting verification</span>
                    </div>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      {stats.pendingCourseOrders}
                    </Badge>
                  </div>
                )}
                
                {stats?.pendingCakeOrders > 0 && (
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-pink-600 mr-2" />
                      <span className="text-sm font-medium">Cake orders to review</span>
                    </div>
                    <Badge variant="outline" className="bg-pink-100 text-pink-800">
                      {stats.pendingCakeOrders}
                    </Badge>
                  </div>
                )}

                {stats?.pendingWorkshopReservations > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Workshop reservations to confirm</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {stats.pendingWorkshopReservations}
                    </Badge>
                  </div>
                )}

                {stats?.unreadContactMessages > 0 && (
                  <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 text-teal-600 mr-2" />
                      <span className="text-sm font-medium">Unread contact messages</span>
                    </div>
                    <Badge variant="outline" className="bg-teal-100 text-teal-800">
                      {stats.unreadContactMessages}
                    </Badge>
                  </div>
                )}

                {(!stats?.pendingCourseOrders && !stats?.pendingCakeOrders && !stats?.pendingWorkshopReservations && !stats?.unreadContactMessages) && (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div>
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-foreground/70">All caught up! No pending actions.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="soft-shadow bg-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Business Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Total Revenue</span>
                  <span className="font-semibold">Tracking in progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Active Workshops</span>
                  <span className="font-semibold">View in workshop management</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Gallery Items</span>
                  <span className="font-semibold">{stats?.totalGalleryItems || 0} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Contact Messages</span>
                  <span className="font-semibold">{stats?.totalContactMessages || 0} total</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Custom Cake Orders</span>
                  <span className={`font-semibold ${customOrdersSetting?.setting_value ? 'text-green-600' : 'text-red-600'}`}>
                    {customOrdersSetting?.setting_value ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Wedding Cake Orders</span>
                  <span className={`font-semibold ${weddingOrdersSetting?.setting_value ? 'text-green-600' : 'text-red-600'}`}>
                    {weddingOrdersSetting?.setting_value ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Workshop Reservations</span>
                  <span className={`font-semibold ${workshopReservationsSetting?.setting_value ? 'text-green-600' : 'text-red-600'}`}>
                    {workshopReservationsSetting?.setting_value ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}