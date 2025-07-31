'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';

const workshopScheduleSchema = z.object({
  workshopName: z.string().min(2, 'Workshop name must be at least 2 characters'),
  workshopType: z.enum(['pinterest', 'decorating', 'complete']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  maxParticipants: z.number().min(1).max(10).optional(),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  location: z.string().default('shop'),
  notes: z.string().optional(),
});

type WorkshopScheduleForm = z.infer<typeof workshopScheduleSchema>;

export default function AdminWorkshops() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const form = useForm<WorkshopScheduleForm>({
    resolver: zodResolver(workshopScheduleSchema),
    defaultValues: {
      workshopName: '',
      workshopType: 'pinterest',
      description: '',
      date: '',
      startTime: '10:00',
      endTime: '14:00',
      maxParticipants: undefined,
      price: undefined,
      discountPrice: undefined,
      location: 'shop',
      notes: '',
    },
  });

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
      await loadWorkshops();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkshops = async () => {
    try {
      const workshopData = await admin.getWorkshopSchedules();
      setWorkshops(workshopData);
    } catch (error) {
      console.error('Error loading workshops:', error);
      toast.error('Failed to load workshops');
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  // Helper function to get default description based on workshop type
  const getDefaultDescription = (type: string) => {
    switch (type) {
      case 'pinterest':
        return 'Learn to create trendy Pinterest-inspired cake designs with hands-on techniques.';
      case 'decorating':
        return 'Advanced piping techniques, fondant art, and professional cake decoration skills.';
      case 'complete':
        return 'From baking to decorating - learn the entire cake-making process in one workshop.';
      default:
        return 'Professional cake making and decorating workshop.';
    }
  };

  // Watch for workshop type changes to suggest default description
  const watchedWorkshopType = form.watch('workshopType');
  useEffect(() => {
    if (watchedWorkshopType && !editingWorkshop) {
      const defaultDesc = getDefaultDescription(watchedWorkshopType);
      form.setValue('description', defaultDesc);
    }
  }, [watchedWorkshopType, editingWorkshop, form]);

  const onSubmit = async (data: WorkshopScheduleForm) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl || editingWorkshop?.image_url;

      if (editingWorkshop) {
        await admin.updateWorkshopSchedule(editingWorkshop.id, {
          workshop_name: data.workshopName,
          workshop_type: data.workshopType,
          description: data.description,
          date: data.date,
          start_time: data.startTime,
          end_time: data.endTime,
          max_participants: data.maxParticipants || 4,
          price: data.price,
          discount_price: data.discountPrice || null,
          location: data.location,
          notes: data.notes,
          image_url: finalImageUrl,
        });
        toast.success('Workshop updated successfully');
      } else {
        await admin.createWorkshopSchedule({
          workshopName: data.workshopName,
          workshopType: data.workshopType,
          description: data.description,
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          maxParticipants: data.maxParticipants || 4,
          price: data.price,
          discountPrice: data.discountPrice,
          location: data.location,
          notes: data.notes,
          imageUrl: finalImageUrl,
        });
        toast.success('Workshop created successfully');
      }

      form.reset();
      setImageUrl('');
      setEditingWorkshop(null);
      setShowAddForm(false);
      await loadWorkshops();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save workshop');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (workshop: any) => {
    setEditingWorkshop(workshop);
    form.reset({
      workshopName: workshop.workshop_name,
      workshopType: workshop.workshop_type,
      description: workshop.description || getDefaultDescription(workshop.workshop_type),
      date: workshop.date,
      startTime: workshop.start_time,
      endTime: workshop.end_time,
      maxParticipants: workshop.max_participants,
      price: workshop.price,
      discountPrice: workshop.discount_price || undefined,
      location: workshop.location,
      notes: workshop.notes || '',
    });
    setImageUrl('');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;

    try {
      await admin.deleteWorkshopSchedule(id);
      toast.success('Workshop deleted successfully');
      await loadWorkshops();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete workshop');
    }
  };

  const cancelEdit = () => {
    setEditingWorkshop(null);
    setShowAddForm(false);
    setImageUrl('');
    form.reset();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading workshop management...</p>
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
              <h1 className="text-4xl font-bold text-foreground font-display">Workshop Management</h1>
              <p className="text-lg text-foreground/70">Manage workshop schedules and availability</p>
            </div>
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Workshop
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="soft-shadow bg-white border-0 mb-8">
            <CardHeader>
              <CardTitle className="font-display">
                {editingWorkshop ? 'Edit Workshop Schedule' : 'Schedule New Workshop'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="workshopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workshop Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter workshop name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workshopType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workshop Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select workshop type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pinterest">Pinterest Workshop</SelectItem>
                              <SelectItem value="decorating">Decorating Workshop</SelectItem>
                              <SelectItem value="complete">Complete Cake Making</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Workshop Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter workshop description..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <p className="text-xs text-foreground/60">
                          This description will be shown to customers on the workshops page
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Workshop Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Workshop Image {editingWorkshop ? '(leave empty to keep current image)' : ''}
                    </label>
                    <CloudinaryUpload
                      onUploadSuccess={handleImageUpload}
                      existingImage={editingWorkshop?.image_url}
                      folder="workshop-images"
                      buttonText="Upload workshop image"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="10"
                              placeholder="4"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                              value={field.value === undefined ? '' : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (DA) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                              value={field.value === undefined ? '' : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Price (DA)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                              value={field.value === undefined ? '' : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Workshop location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about the workshop..."
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
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : (editingWorkshop ? 'Update Workshop' : 'Schedule Workshop')}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={cancelEdit}
                      className="btn-outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Workshops List */}
        <div className="space-y-6">
          {workshops.map((workshop) => (
            <Card key={workshop.id} className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-6">
                      {/* Workshop Image */}
                      {workshop.image_url ? (
                        <img
                          src={workshop.image_url}
                          alt={workshop.workshop_name}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      {/* Workshop Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-xl font-bold text-foreground font-display">{workshop.workshop_name}</h3>
                          {getStatusBadge(workshop.status)}
                          <Badge variant="outline" className="capitalize">
                            {workshop.workshop_type}
                          </Badge>
                        </div>
                        
                        {/* Workshop Description */}
                        {workshop.description && (
                          <p className="text-foreground/70 mb-4 leading-relaxed">
                            {workshop.description}
                          </p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-foreground/70">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(workshop.date), 'PPP')}
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

                        {workshop.notes && (
                          <p className="mt-4 text-sm text-foreground/70 bg-gray-50 p-3 rounded-lg">
                            {workshop.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(workshop)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(workshop.id)}
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

        {workshops.length === 0 && (
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12">
              <Calendar className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4 font-display">No Workshops Scheduled</h3>
              <p className="text-foreground/70 mb-6">
                Start by scheduling your first workshop.
              </p>
              <Button 
                className="btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Workshop
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}