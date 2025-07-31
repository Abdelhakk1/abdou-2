import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Cake,
  Edit,
  Trash2,
  Plus,
  Upload,
  Eye,
  Download,
  X,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  User,
  MapPin
} from 'lucide-react';

// Admin Dashboard Component
export const AdminDashboard = () => {
  // Sample data for demonstration
  const stats = {
    totalCourseOrders: 24,
    pendingCourseOrders: 5,
    totalCakeOrders: 42,
    pendingCakeOrders: 8,
    totalWorkshopReservations: 18,
    pendingWorkshopReservations: 3,
    totalGalleryItems: 36,
    totalContactMessages: 15,
    unreadContactMessages: 4
  };

  const systemSettings = [
    { setting_key: 'custom_orders_open', setting_value: true },
    { setting_key: 'workshop_reservations_open', setting_value: true },
    { setting_key: 'wedding_orders_open', setting_value: true }
  ];

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
    }
  ];

  return (
    <div className="space-y-8">
      {/* System Controls */}
      <Card className="soft-shadow bg-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center font-display">
            <Settings className="h-6 w-6 mr-3" />
            System Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground font-display">Custom Cake Orders</h3>
                <p className="text-sm text-foreground/70">
                  Currently accepting orders
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <ToggleRight className="h-6 w-6 text-green-600" />
                <Switch checked={true} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground font-display">Wedding Cake Orders</h3>
                <p className="text-sm text-foreground/70">
                  Currently accepting orders
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <ToggleRight className="h-6 w-6 text-green-600" />
                <Switch checked={true} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground font-display">Workshop Reservations</h3>
                <p className="text-sm text-foreground/70">
                  Currently accepting reservations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <ToggleRight className="h-6 w-6 text-green-600" />
                <Switch checked={true} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                <p className="text-2xl font-bold text-foreground">{stats.totalGalleryItems}</p>
                <p className="text-sm text-green-600">Active</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Image className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 font-display">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${action.color} rounded-lg p-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 font-display">{action.title}</h3>
                    <p className="text-sm text-foreground/70">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="soft-shadow bg-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center font-display">
              <AlertCircle className="h-5 w-5 mr-2" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium">Course orders awaiting verification</span>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {stats.pendingCourseOrders}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-pink-600 mr-2" />
                  <span className="text-sm font-medium">Cake orders to review</span>
                </div>
                <Badge variant="outline" className="bg-pink-100 text-pink-800">
                  {stats.pendingCakeOrders}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Workshop reservations to confirm</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {stats.pendingWorkshopReservations}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 text-teal-600 mr-2" />
                  <span className="text-sm font-medium">Unread contact messages</span>
                </div>
                <Badge variant="outline" className="bg-teal-100 text-teal-800">
                  {stats.unreadContactMessages}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="soft-shadow bg-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center font-display">
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
                <span className="font-semibold">{stats.totalGalleryItems} items</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Contact Messages</span>
                <span className="font-semibold">{stats.totalContactMessages} total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Custom Cake Orders</span>
                <span className="font-semibold text-green-600">Open</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Wedding Cake Orders</span>
                <span className="font-semibold text-green-600">Open</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Workshop Reservations</span>
                <span className="font-semibold text-green-600">Open</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Gallery Management Component
export const GalleryManagement = () => {
  // Sample data for demonstration
  const galleryItems = [
    {
      id: '1',
      title: 'Elegant Wedding Cake',
      description: 'Three-tier white wedding cake with floral decorations',
      image_url: '/wedding-cake-2.JPG',
      category: 'cakes',
      featured: true,
      display_order: 1
    },
    {
      id: '2',
      title: 'Birthday Celebration',
      description: 'Colorful birthday cake with custom decorations',
      image_url: '/black and white 2.JPG',
      category: 'cakes',
      featured: false,
      display_order: 2
    },
    {
      id: '3',
      title: 'Workshop Students',
      description: 'Students learning cake decoration techniques',
      image_url: '/green-cake.JPG',
      category: 'workshops',
      featured: true,
      display_order: 3
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground font-display">Gallery Management</h2>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Card className="soft-shadow bg-white border-0 mb-8">
        <CardHeader>
          <CardTitle className="font-display">Add New Gallery Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <Input placeholder="Enter image title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cakes">Custom Cakes</SelectItem>
                    <SelectItem value="wedding">Wedding Cakes</SelectItem>
                    <SelectItem value="workshops">Workshop Photos</SelectItem>
                    <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Textarea placeholder="Enter image description..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Image *
              </label>
              <div className="border-2 border-dashed border-foreground/20 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-foreground/40 mx-auto mb-4" />
                <p className="text-foreground/60 mb-2">Drag and drop an image, or click to browse</p>
                <Button variant="outline" size="sm">Upload Image</Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="btn-primary">
                Add Item
              </Button>
              <Button type="button" variant="outline" className="btn-outline">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Gallery Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
            <div className="relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {item.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className="absolute top-2 right-2 bg-white/90 text-foreground"
              >
                {item.category === 'cakes' ? 'Custom Cakes' : 
                 item.category === 'wedding' ? 'Wedding Cakes' :
                 item.category === 'workshops' ? 'Workshop Photos' : 
                 'Behind the Scenes'}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 font-display">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">
                  Order: {item.display_order}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Workshop Management Component
export const WorkshopManagement = () => {
  // Sample data for demonstration
  const workshops = [
    {
      id: '1',
      workshop_name: 'Pinterest Cake Decorating',
      workshop_type: 'pinterest',
      description: 'Learn to create trendy Pinterest-inspired cake designs with hands-on techniques.',
      date: '2025-08-15',
      start_time: '10:00',
      end_time: '14:00',
      max_participants: 6,
      current_participants: 2,
      price: 5000,
      discount_price: 4500,
      status: 'active',
      location: 'Soundous Bake Shop',
      image_url: '/green-cake.JPG'
    },
    {
      id: '2',
      workshop_name: 'Advanced Fondant Techniques',
      workshop_type: 'decorating',
      description: 'Master advanced fondant techniques for professional-looking cake decorations.',
      date: '2025-08-22',
      start_time: '13:00',
      end_time: '17:00',
      max_participants: 4,
      current_participants: 4,
      price: 6000,
      discount_price: null,
      status: 'active',
      location: 'Soundous Bake Shop',
      image_url: '/black and white 2.JPG'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground font-display">Workshop Management</h2>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Workshop
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Card className="soft-shadow bg-white border-0 mb-8">
        <CardHeader>
          <CardTitle className="font-display">Schedule New Workshop</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Workshop Name *</label>
                <Input placeholder="Enter workshop name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Workshop Type *</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workshop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pinterest">Pinterest Workshop</SelectItem>
                    <SelectItem value="decorating">Decorating Workshop</SelectItem>
                    <SelectItem value="complete">Complete Cake Making</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <Textarea placeholder="Enter workshop description..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Time *</label>
                <Input type="time" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Time *</label>
                <Input type="time" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Max Participants *</label>
                <Input type="number" min="1" max="10" placeholder="4" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price (DA) *</label>
                <Input type="number" min="0" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Discount Price (DA)</label>
                <Input type="number" min="0" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Workshop Image
              </label>
              <div className="border-2 border-dashed border-foreground/20 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-foreground/40 mx-auto mb-4" />
                <p className="text-foreground/60 mb-2">Drag and drop an image, or click to browse</p>
                <Button variant="outline" size="sm">Upload Image</Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="btn-primary">
                Schedule Workshop
              </Button>
              <Button type="button" variant="outline" className="btn-outline">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Workshops List */}
      <div className="space-y-6">
        {workshops.map((workshop) => {
          const availableSpots = workshop.max_participants - workshop.current_participants;
          const isFullyBooked = availableSpots <= 0;

          return (
            <Card key={workshop.id} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
              <div className="flex items-start p-6">
                <div className="w-32 h-32 mr-6 flex-shrink-0">
                  {workshop.image_url ? (
                    <img
                      src={workshop.image_url}
                      alt={workshop.workshop_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground font-display">{workshop.workshop_name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="capitalize">
                          {workshop.workshop_type}
                        </Badge>
                        {isFullyBooked && (
                          <Badge className="bg-red-500 text-white">
                            Fully Booked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-foreground/70 mb-4 leading-relaxed">
                    {workshop.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-foreground/70">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(workshop.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {workshop.start_time} - {workshop.end_time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {workshop.current_participants}/{workshop.max_participants} participants
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {workshop.location}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <span className="font-semibold text-foreground">
                      {workshop.discount_price ? (
                        <>
                          <span className="text-green-600">{workshop.discount_price.toLocaleString()} DA</span>
                          <span className="text-foreground/50 line-through ml-2">
                            {workshop.price.toLocaleString()} DA
                          </span>
                        </>
                      ) : (
                        <span>{workshop.price.toLocaleString()} DA</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Course Management Component
export const CourseManagement = () => {
  // Sample data for demonstration
  const courses = [
    {
      id: '1',
      title: 'Complete Cake Decorating Masterclass',
      description: 'Learn professional cake decorating techniques from basic to advanced in this comprehensive online course.',
      price: 12000,
      discount_price: 9500,
      duration_hours: 8,
      module_count: 12,
      image_url: '/purpel cake.jpg',
      google_drive_link: 'https://drive.google.com/drive/folders/example1',
      status: 'active',
      features: ['Lifetime access', 'Certificate of completion', 'Q&A support'],
      modules: [
        { title: 'Introduction to Cake Decorating', description: 'Basic tools and techniques', duration: '45 minutes' },
        { title: 'Buttercream Basics', description: 'Creating smooth surfaces and basic patterns', duration: '60 minutes' }
      ]
    },
    {
      id: '2',
      title: 'Wedding Cake Design',
      description: 'Specialized course focused on wedding cake design, structure, and advanced decorating techniques.',
      price: 15000,
      discount_price: null,
      duration_hours: 10,
      module_count: 8,
      image_url: '/wedding-cake-2.JPG',
      google_drive_link: 'https://drive.google.com/drive/folders/example2',
      status: 'active',
      features: ['Lifetime access', 'Certificate of completion', 'Q&A support', 'Design templates'],
      modules: [
        { title: 'Wedding Cake Fundamentals', description: 'Planning and structure', duration: '60 minutes' },
        { title: 'Tiered Cake Construction', description: 'Building stable multi-tier cakes', duration: '90 minutes' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground font-display">Course Management</h2>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Add/Edit Form */}
      <Card className="soft-shadow bg-white border-0 mb-8">
        <CardHeader>
          <CardTitle className="font-display">Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Course Title *</label>
              <Input placeholder="Enter course title" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
              <Textarea 
                placeholder="Enter course description..."
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Course Image *
              </label>
              <div className="border-2 border-dashed border-foreground/20 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-foreground/40 mx-auto mb-4" />
                <p className="text-foreground/60 mb-2">Drag and drop an image, or click to browse</p>
                <Button variant="outline" size="sm">Upload Image</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price (DA) *</label>
                <Input type="number" min="0" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Discount Price (DA)</label>
                <Input type="number" min="0" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration (Hours)</label>
                <Input type="number" min="1" placeholder="" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Modules</label>
                <Input type="number" min="1" placeholder="" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Google Drive Link</label>
              <Input placeholder="https://drive.google.com/..." />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="btn-primary">
                Create Course
              </Button>
              <Button type="button" variant="outline" className="btn-outline">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Courses List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <Card key={course.id} className="soft-shadow bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-xl font-bold text-foreground font-display">{course.title}</h3>
                    <Badge className={`${
                      course.status === 'active' ? 'bg-green-100 text-green-800' : 
                      course.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    } border-0`}>
                      {course.status === 'active' ? 'Active' : 
                       course.status === 'inactive' ? 'Inactive' : 
                       'Draft'}
                    </Badge>
                  </div>
                  
                  <p className="text-foreground/70 mb-4 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-foreground/70 mb-4">
                    {course.duration_hours && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {course.duration_hours} hours
                      </div>
                    )}
                    {course.module_count && (
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {course.module_count} modules
                      </div>
                    )}
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Lifetime access
                    </div>
                    {course.google_drive_link && (
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <a 
                          href={course.google_drive_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Course Materials
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-foreground">
                      {course.discount_price ? (
                        <>
                          <span className="text-green-600">{course.discount_price.toLocaleString()} DA</span>
                          <span className="text-foreground/50 line-through ml-2">
                            {course.price.toLocaleString()} DA
                          </span>
                        </>
                      ) : (
                        <span>{course.price.toLocaleString()} DA</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Cake Orders Management Component
export const CakeOrdersManagement = () => {
  // Sample data for demonstration
  const orders = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '0555123456',
      email: 'sarah@example.com',
      event_date: '2025-08-20',
      cake_type: 'Birthday Cake',
      size: '15cm',
      shape: 'circle',
      flavor: 'Chocolate',
      special_instructions: 'Please add "Happy 30th Birthday Lisa!" on the cake. Would like some gold accents if possible.',
      status: 'pending',
      created_at: '2025-07-15T09:30:00Z',
      instagram_username: '@sarahjohnson',
      inspiration_image_url: '/black and white 2.JPG'
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      phone: '0555789012',
      email: 'mohammed@example.com',
      event_date: '2025-08-25',
      cake_type: 'Anniversary Cake',
      size: '20cm',
      shape: 'heart',
      flavor: 'Vanilla',
      special_instructions: 'This is for our 5th wedding anniversary. We would like a simple, elegant design with white and silver colors.',
      status: 'confirmed',
      created_at: '2025-07-10T14:45:00Z',
      instagram_username: '@mohammedali',
      inspiration_image_url: '/wedding-cake-2.JPG'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground font-display">Custom Cake Orders</h2>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="soft-shadow bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-xl font-bold text-foreground font-display">{order.cake_type}</h3>
                    <Badge className={`${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    } border-0`}>
                      {order.status === 'pending' ? 'Pending' : 
                       order.status === 'confirmed' ? 'Confirmed' : 
                       order.status === 'in_progress' ? 'In Progress' : 
                       order.status === 'completed' ? 'Completed' : 
                       'Cancelled'}
                    </Badge>
                  </div>
                  
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70 mb-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {order.name}
                    </div>
                    <div className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2" />
                      {order.instagram_username}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Event: {new Date(order.event_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  {/* Cake Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-foreground mb-3 font-display">Cake Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70">
                      <div className="flex items-center">
                        <Cake className="h-4 w-4 mr-2" />
                        Flavor: {order.flavor}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Size: {order.size}
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 mr-2">
                          {order.shape === 'circle' ? '⭕' : 
                           order.shape === 'heart' ? '❤️' : 
                           order.shape === 'square' ? '⬛' : 
                           '🔶'}
                        </div>
                        Shape: {order.shape.charAt(0).toUpperCase() + order.shape.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.special_instructions && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2 font-display">Special Instructions:</h4>
                      <p className="text-foreground/70 bg-gray-50 p-3 rounded-lg text-sm">
                        {order.special_instructions}
                      </p>
                    </div>
                  )}

                  {/* Inspiration Image */}
                  {order.inspiration_image_url && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3 font-display">Inspiration Image:</h4>
                      <div className="relative inline-block">
                        <img
                          src={order.inspiration_image_url}
                          alt="Customer inspiration"
                          className="w-32 h-32 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <Select defaultValue={order.status}>
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
    </div>
  );
};

// Course Orders Management Component
export const CourseOrdersManagement = () => {
  // Sample data for demonstration
  const orders = [
    {
      id: '1',
      course_name: 'Complete Cake Decorating Masterclass',
      amount: 9500,
      payment_method: 'baridimob',
      status: 'paid',
      created_at: '2025-07-10T08:15:00Z',
      users: {
        full_name: 'Amina Benali',
        email: 'amina@example.com',
        phone: '0555234567'
      },
      payment_receipts: [
        {
          id: '101',
          transaction_number: 'BM12345678',
          amount: '9500',
          receipt_url: '/black and white 2.JPG',
          notes: 'Paid via BaridiMob',
          verified: false,
          created_at: '2025-07-10T09:30:00Z'
        }
      ]
    },
    {
      id: '2',
      course_name: 'Wedding Cake Design',
      amount: 15000,
      payment_method: 'ccp',
      status: 'verified',
      created_at: '2025-07-05T14:20:00Z',
      users: {
        full_name: 'Karim Hadj',
        email: 'karim@example.com',
        phone: '0555876543'
      },
      payment_receipts: [
        {
          id: '102',
          transaction_number: 'CCP87654321',
          amount: '15000',
          receipt_url: '/wedding-cake-2.JPG',
          notes: 'CCP transfer receipt',
          verified: true,
          created_at: '2025-07-05T15:45:00Z'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground font-display">Course Orders</h2>

      {/* Status Explanation */}
      <Card className="soft-shadow bg-blue-50 border-blue-200 mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3 font-display">Order Status Guide:</h3>
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
                    {order.status === 'verified' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : order.status === 'paid' ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-foreground font-display">{order.course_name}</h3>
                      <p className="text-foreground/70">
                        Ordered on {new Date(order.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-foreground/70 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {order.users.full_name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {order.users.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.users.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(order.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
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
                      <Badge className={`${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'paid' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'verified' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      } border-0`}>
                        {order.status === 'pending' ? 'Pending Payment' : 
                         order.status === 'paid' ? 'Payment Submitted' : 
                         order.status === 'verified' ? 'Verified' : 
                         'Cancelled'}
                      </Badge>
                      
                      {/* Status Update Dropdown */}
                      <Select defaultValue={order.status}>
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
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Verify Payment
                    </Button>
                  )}
                </div>
              </div>

              {/* Payment Receipts */}
              {order.payment_receipts && order.payment_receipts.length > 0 && (
                <div className="border-t border-foreground/10 pt-4">
                  <h4 className="font-semibold text-foreground mb-3 font-display">Payment Receipts</h4>
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
                            className="btn-outline"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Receipt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="btn-outline"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
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
    </div>
  );
};

// Workshop Reservations Management Component
export const WorkshopReservationsManagement = () => {
  // Sample data for demonstration
  const reservations = [
    {
      id: '1',
      workshop_name: 'Pinterest Cake Decorating',
      first_name: 'Leila',
      last_name: 'Benmansour',
      phone: '0555345678',
      email: 'leila@example.com',
      participants: 2,
      age_group: 'adults',
      location: 'shop',
      preferred_date: '2025-08-15',
      additional_info: 'We are looking forward to learning cake decoration techniques!',
      status: 'pending',
      created_at: '2025-07-12T10:15:00Z'
    },
    {
      id: '2',
      workshop_name: 'Advanced Fondant Techniques',
      first_name: 'Youcef',
      last_name: 'Kaddour',
      phone: '0555901234',
      email: 'youcef@example.com',
      participants: 1,
      age_group: 'adults',
      location: 'shop',
      preferred_date: '2025-08-22',
      additional_info: null,
      status: 'confirmed',
      created_at: '2025-07-08T16:30:00Z'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground font-display">Workshop Reservations</h2>

      {/* Reservations List */}
      <div className="space-y-6">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="soft-shadow bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-xl font-bold text-foreground font-display">{reservation.workshop_name}</h3>
                    <Badge className={`${
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    } border-0`}>
                      {reservation.status === 'pending' ? 'Pending' : 
                       reservation.status === 'confirmed' ? 'Confirmed' : 
                       'Cancelled'}
                    </Badge>
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
                      {new Date(reservation.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
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
                        Workshop: {new Date(reservation.preferred_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>

                  {reservation.additional_info && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2 font-display">Additional Information:</h4>
                      <p className="text-foreground/70 bg-gray-50 p-3 rounded-lg text-sm">
                        {reservation.additional_info}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <Select defaultValue={reservation.status}>
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
    </div>
  );
};

// Contact Messages Management Component
export const ContactMessagesManagement = () => {
  // Sample data for demonstration
  const messages = [
    {
      id: '1',
      name: 'Fatima Bouaziz',
      email: 'fatima@example.com',
      phone: '0555123456',
      subject: 'Wedding Cake Inquiry',
      message: 'Hello, I\'m getting married next spring and I\'m interested in ordering a wedding cake. Could you please provide information about your wedding cake options, pricing, and the booking process? Thank you!',
      status: 'unread',
      created_at: '2025-07-02T09:15:00Z'
    },
    {
      id: '2',
      name: 'Ahmed Rahmani',
      email: 'ahmed@example.com',
      phone: '0555789012',
      subject: 'Workshop Availability',
      message: 'Hi, I\'m interested in attending one of your cake decorating workshops. Do you have any upcoming sessions in August? I\'d like to bring my daughter (she\'s 12) - are children allowed to participate? Thanks in advance!',
      status: 'read',
      created_at: '2025-07-01T14:30:00Z'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '0555123456',
      subject: 'Custom Cake Inquiry',
      message: 'Hello, I\'m interested in ordering a custom cake for my daughter\'s birthday next month. Could you please let me know what options are available and what information you need from me to get started? Thank you!',
      status: 'unread',
      created_at: '2025-07-01T10:30:00Z'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground font-display">Contact Messages</h2>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 border-0 cursor-pointer ${
                  message.status === 'unread' ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-foreground font-display">{message.name}</h3>
                        <Badge className={`${
                          message.status === 'unread' ? 'bg-yellow-100 text-yellow-800' : 
                          message.status === 'read' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        } border-0 flex items-center`}>
                          {message.status === 'unread' ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Unread
                            </>
                          ) : message.status === 'read' ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Read
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Replied
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70 mb-2">{message.email}</p>
                      <h4 className="font-semibold text-foreground mb-2 font-display">{message.subject}</h4>
                      <p className="text-foreground/70 text-sm line-clamp-2 leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                    <div className="text-right text-xs text-foreground/50 ml-4">
                      {new Date(message.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      <br />
                      {new Date(message.created_at).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: 'numeric' 
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div>
          <Card className="soft-shadow bg-white border-0 sticky top-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground flex items-center font-display">
                <MessageSquare className="h-5 w-5 mr-2" />
                Message Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-foreground/50" />
                  <span className="font-semibold">Fatima Bouaziz</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-foreground/50" />
                  <a href="mailto:fatima@example.com" className="text-blue-600 hover:underline">
                    fatima@example.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-foreground/50" />
                  <a href="tel:0555123456" className="text-blue-600 hover:underline">
                    0555123456
                  </a>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-foreground/50" />
                  <span className="text-sm text-foreground/70">
                    July 2, 2025, 9:15 AM
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 font-display">Subject:</h4>
                <p className="text-foreground/80">Wedding Cake Inquiry</p>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 font-display">Message:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    Hello, I'm getting married next spring and I'm interested in ordering a wedding cake. Could you please provide information about your wedding cake options, pricing, and the booking process? Thank you!
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 font-display">Status:</h4>
                <Select defaultValue="unread">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 font-display">Admin Notes:</h4>
                <Textarea
                  placeholder="Add internal notes about this message..."
                  className="min-h-[80px]"
                />
                <Button
                  className="mt-2 btn-outline w-full"
                >
                  Save Notes
                </Button>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  className="flex-1 btn-primary"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Unavailable Dates Management Component
export const UnavailableDatesManagement = () => {
  // Sample data for demonstration
  const unavailableDates = [
    {
      id: '1',
      date: '2025-08-10',
      reason: 'Staff training day',
      type: 'manual'
    },
    {
      id: '2',
      date: '2025-08-15',
      reason: 'Public holiday',
      type: 'manual'
    },
    {
      id: '3',
      date: '2025-08-20',
      reason: 'Already booked',
      type: 'booked'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground font-display">Unavailable Dates</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Calendar and Add Date */}
        <div className="space-y-8">
          <Card className="soft-shadow bg-white border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground font-display">
                Mark Date as Unavailable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Date
                </label>
                <div className="border rounded-md p-4">
                  {/* Calendar placeholder */}
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
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
                  className="min-h-[80px]"
                />
              </div>

              <Button className="w-full btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Mark as Unavailable
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="soft-shadow bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2 font-display">How it works</h3>
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
              <CardTitle className="text-xl font-bold text-foreground font-display">
                Current Unavailable Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {unavailableDates
                  .filter(date => date.type === 'manual')
                  .map((unavailableDate) => (
                    <div 
                      key={unavailableDate.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {new Date(unavailableDate.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
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
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                
                {/* Show booked dates (read-only) */}
                {unavailableDates
                  .filter(date => date.type === 'booked')
                  .map((unavailableDate) => (
                    <div 
                      key={unavailableDate.id} 
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {new Date(unavailableDate.date).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};