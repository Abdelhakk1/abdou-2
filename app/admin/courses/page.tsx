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
  BookOpen,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
  X
} from 'lucide-react';
import Link from 'next/link';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';

const courseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  durationHours: z.number().optional(),
  moduleCount: z.number().optional(),
  googleDriveLink: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
  features: z.array(z.string()).optional(),
  modules: z.array(z.object({
    title: z.string(),
    description: z.string(),
    duration: z.string().optional(),
  })).optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function AdminCourses() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [modules, setModules] = useState<any[]>([{ title: '', description: '', duration: '' }]);

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      discountPrice: undefined,
      durationHours: undefined,
      moduleCount: undefined,
      googleDriveLink: '',
      status: 'draft',
      features: [],
      modules: [],
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
      await loadCourses();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const courseData = await admin.getOnlineCourses();
      setCourses(courseData);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
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
  const watchedWorkshopType = form.watch('status');
  useEffect(() => {
    if (watchedWorkshopType && !editingCourse) {
      const defaultDesc = getDefaultDescription(watchedWorkshopType);
      form.setValue('description', defaultDesc);
    }
  }, [watchedWorkshopType, editingCourse, form]);

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addModule = () => {
    setModules([...modules, { title: '', description: '', duration: '' }]);
  };

  const updateModule = (index: number, field: string, value: string) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CourseForm) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl || editingCourse?.image_url;

      const courseData = {
        title: data.title,
        description: data.description,
        price: data.price,
        discount_price: data.discountPrice || null,
        duration_hours: data.durationHours || null,
        module_count: data.moduleCount || null,
        image_url: finalImageUrl || null,
        google_drive_link: data.googleDriveLink || null,
        status: data.status,
        features: features.filter(f => f.trim() !== ''),
        modules: modules.filter(m => m.title.trim() !== ''),
      };

      if (editingCourse) {
        await admin.updateOnlineCourse(editingCourse.id, courseData);
        toast.success('Course updated successfully');
      } else {
        await admin.createOnlineCourse({
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          discountPrice: courseData.discount_price,
          durationHours: courseData.duration_hours,
          moduleCount: courseData.module_count,
          imageUrl: courseData.image_url,
          googleDriveLink: courseData.google_drive_link,
          features: courseData.features,
          modules: courseData.modules,
        });
        toast.success('Course created successfully');
      }

      form.reset();
      setFeatures(['']);
      setModules([{ title: '', description: '', duration: '' }]);
      setImageUrl('');
      setEditingCourse(null);
      setShowAddForm(false);
      await loadCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    form.reset({
      title: course.title,
      description: course.description,
      price: course.price,
      discountPrice: course.discount_price || undefined,
      durationHours: course.duration_hours || undefined,
      moduleCount: course.module_count || undefined,
      googleDriveLink: course.google_drive_link || '',
      status: course.status,
    });
    setFeatures(course.features && course.features.length > 0 ? course.features : ['']);
    setModules(course.modules && course.modules.length > 0 ? course.modules : [{ title: '', description: '', duration: '' }]);
    setImageUrl('');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await admin.deleteOnlineCourse(id);
      toast.success('Course deleted successfully');
      await loadCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setShowAddForm(false);
    setImageUrl('');
    setFeatures(['']);
    setModules([{ title: '', description: '', duration: '' }]);
    form.reset();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inactive' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
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
          <p className="text-foreground/70">Loading course management...</p>
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
              <h1 className="text-4xl font-bold text-foreground font-display">Course Management</h1>
              <p className="text-lg text-foreground/70">Create and manage online courses</p>
            </div>
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="soft-shadow bg-white border-0 mb-8">
            <CardHeader>
              <CardTitle className="font-display">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter course description..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Course Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Course Image {editingCourse ? '(leave empty to keep current image)' : ''}
                    </label>
                    <CloudinaryUpload
                      onUploadSuccess={handleImageUpload}
                      existingImage={editingCourse?.image_url}
                      folder="course-images"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="durationHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Hours)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder=""
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                                field.onChange(value);
                              }}
                              value={field.value === undefined ? '' : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="moduleCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Modules</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder=""
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                                field.onChange(value);
                              }}
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
                    name="googleDriveLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Drive Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://drive.google.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Features Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-foreground">Course Features</label>
                      <Button type="button" onClick={addFeature} size="sm" className="btn-outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder="Enter feature description"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                          />
                          {features.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeFeature(index)}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modules Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-foreground">Course Modules</label>
                      <Button type="button" onClick={addModule} size="sm" className="btn-outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Module
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {modules.map((module, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Module {index + 1}</h4>
                            {modules.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeModule(index)}
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Module title"
                              value={module.title}
                              onChange={(e) => updateModule(index, 'title', e.target.value)}
                            />
                            <Input
                              placeholder="Duration (e.g., 45 minutes)"
                              value={module.duration}
                              onChange={(e) => updateModule(index, 'duration', e.target.value)}
                            />
                          </div>
                          <Textarea
                            placeholder="Module description"
                            value={module.description}
                            onChange={(e) => updateModule(index, 'description', e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
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

        {/* Courses List */}
        <div className="space-y-6">
          {courses.map((course) => (
            <Card key={course.id} className="soft-shadow bg-white border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-bold text-foreground font-display">{course.title}</h3>
                      {getStatusBadge(course.status)}
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
                      onClick={() => handleEdit(course)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(course.id)}
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

        {courses.length === 0 && (
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12">
              <BookOpen className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4 font-display">No Courses Created</h3>
              <p className="text-foreground/70 mb-6">
                Start by creating your first online course.
              </p>
              <Button 
                className="btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Course
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}