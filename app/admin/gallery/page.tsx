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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { admin } from '@/lib/admin';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Star,
  Eye,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';

const galleryItemSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  category: z.enum(['cakes', 'workshops', 'behind-scenes', 'wedding']),
  featured: z.boolean().default(false),
  displayOrder: z.number().min(0).default(0),
});

type GalleryItemForm = z.infer<typeof galleryItemSchema>;

export default function AdminGallery() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GalleryItemForm>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'cakes',
      featured: false,
      displayOrder: 0,
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
      await loadGalleryItems();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGalleryItems = async () => {
    try {
      const items = await admin.getGalleryItems();
      setGalleryItems(items);
    } catch (error) {
      console.error('Error loading gallery items:', error);
      toast.error('Failed to load gallery items');
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  const onSubmit = async (data: GalleryItemForm) => {
    if (!imageUrl && !editingItem) {
      toast.error('Please upload an image');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalImageUrl = imageUrl || editingItem?.image_url;

      if (editingItem) {
        await admin.updateGalleryItem(editingItem.id, {
          title: data.title,
          description: data.description,
          category: data.category,
          featured: data.featured,
          display_order: data.displayOrder,
          image_url: finalImageUrl,
        });
        toast.success('Gallery item updated successfully');
      } else {
        await admin.createGalleryItem({
          title: data.title,
          description: data.description,
          imageUrl: finalImageUrl!,
          category: data.category,
          featured: data.featured,
          displayOrder: data.displayOrder,
        });
        toast.success('Gallery item created successfully');
      }

      form.reset();
      setImageUrl('');
      setEditingItem(null);
      setShowAddForm(false);
      await loadGalleryItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      description: item.description || '',
      category: item.category,
      featured: item.featured,
      displayOrder: item.display_order,
    });
    setImageUrl('');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      await admin.deleteGalleryItem(id);
      toast.success('Gallery item deleted successfully');
      await loadGalleryItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gallery item');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setImageUrl('');
    form.reset();
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
              <h1 className="text-4xl font-bold text-foreground">Gallery Management</h1>
              <p className="text-lg text-foreground/70">Add, edit, and organize gallery images</p>
            </div>
          </div>
          <Button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="soft-shadow bg-white border-0 mb-8">
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter image title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cakes">Custom Cakes</SelectItem>
                              <SelectItem value="wedding">Wedding Cakes</SelectItem>
                              <SelectItem value="workshops">Workshop Photos</SelectItem>
                              <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter image description..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="displayOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value === 0 ? '' : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Item</FormLabel>
                            <p className="text-sm text-foreground/70">
                              Featured items are highlighted in the gallery
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Image {editingItem ? '(leave empty to keep current image)' : '*'}
                    </label>
                    <CloudinaryUpload
                      onUploadSuccess={handleImageUpload}
                      existingImage={editingItem?.image_url}
                      folder="gallery"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
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
                    <Star className="h-3 w-3 mr-1" />
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
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
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
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
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

        {galleryItems.length === 0 && (
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12">
              <ImageIcon className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-4">No Gallery Items</h3>
              <p className="text-foreground/70 mb-6">
                Start by adding your first gallery item.
              </p>
              <Button 
                className="btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}