"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Camera, Users, X } from 'lucide-react';
import { toast } from 'sonner';
// Removed supabase import - using API calls instead

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'cakes', name: 'Custom Cakes' },
    { id: 'wedding', name: 'Wedding Cakes' },
    { id: 'workshops', name: 'Workshop Photos' },
    { id: 'behind-scenes', name: 'Behind the Scenes' }
  ];

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error('Failed to load gallery items');
      }
      
      const data = await response.json();
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error loading gallery items:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cakes':
        return <Camera className="h-3 w-3 mr-1" />;
      case 'wedding':
        return <Camera className="h-3 w-3 mr-1" />;
      case 'workshops':
        return <Users className="h-3 w-3 mr-1" />;
      case 'behind-scenes':
        return <Camera className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj?.name || category;
  };

  const openImageModal = (item: any) => {
    setSelectedImage(item);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading gallery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 custom-underline">
            Gallery
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Explore our collection of beautiful custom cakes, wedding cakes, workshop moments, and behind-the-scenes glimpses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <Card className="soft-shadow bg-peach border-0 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-sm md:text-base text-foreground/70">Custom Cakes Created</div>
            </CardContent>
          </Card>
          <Card className="soft-shadow bg-lavender border-0 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">150+</div>
              <div className="text-sm md:text-base text-foreground/70">Students Trained</div>
            </CardContent>
          </Card>
          <Card className="soft-shadow bg-mint border-0 text-center">
            <CardContent className="p-6 md:p-8">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">5.0</div>
              <div className="text-sm md:text-base text-foreground/70">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4 md:gap-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? 'btn-primary' 
                    : 'btn-outline'
                } text-sm px-4 py-2`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={`h-10 w-10 ${
                viewMode === 'grid' 
                  ? 'bg-foreground text-background hover:bg-foreground/90' 
                  : 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode('list')}
              className={`h-10 w-10 ${
                viewMode === 'list' 
                  ? 'bg-foreground text-background hover:bg-foreground/90' 
                  : 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className={`grid gap-6 md:gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'
          }`}>
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0 cursor-pointer"
                onClick={() => openImageModal(item)}
              >
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      viewMode === 'grid' ? 'h-48 md:h-64' : 'h-64 md:h-80'
                    }`}
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 md:top-4 left-3 md:left-4 flex flex-col gap-2">
                    {item.featured && (
                      <Badge className="bg-foreground text-background font-medium text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/90 text-foreground border-foreground/20 text-xs">
                      {getCategoryIcon(item.category)}
                      {getCategoryDisplayName(item.category)}
                    </Badge>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="btn-primary text-sm md:text-base">
                      View Image
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 md:p-6">
                  <h3 className="font-bold text-foreground mb-2 text-base md:text-lg group-hover:text-foreground/80 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="soft-shadow bg-white border-0 text-center">
            <CardContent className="p-12 md:p-16">
              <Camera className="h-12 w-12 md:h-16 md:w-16 text-foreground/30 mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                {selectedCategory === 'all' ? 'No Gallery Items' : `No ${getCategoryDisplayName(selectedCategory)} Yet`}
              </h3>
              <p className="text-foreground/70 mb-6 md:mb-8 max-w-md mx-auto">
                {selectedCategory === 'all' 
                  ? 'Gallery items will appear here once they are added from the admin dashboard.'
                  : `${getCategoryDisplayName(selectedCategory)} will appear here once they are added.`
                }
              </p>
              {selectedCategory !== 'all' && (
                <Button 
                  className="btn-outline"
                  onClick={() => setSelectedCategory('all')}
                >
                  View All Categories
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-16 md:mt-24 text-center">
          <Card className="soft-shadow bg-pink border-0">
            <CardContent className="p-12 md:p-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Ready to Create Your Masterpiece?
              </h2>
              <p className="text-base md:text-lg text-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Whether you want a custom cake for your special event or want to learn these techniques yourself, 
                we're here to help make your sweet dreams come true.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button asChild className="btn-primary px-6 md:px-8 py-3 w-full sm:w-auto">
                  <a href="/custom">Order Custom Cake</a>
                </Button>
                <Button asChild className="btn-primary px-6 md:px-8 py-3 w-full sm:w-auto">
                  <a href="/wedding">Order Wedding Cake</a>
                </Button>
                <Button asChild className="btn-outline px-6 md:px-8 py-3 w-full sm:w-auto">
                  <a href="/workshops">Join Workshop</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 rounded-b-lg">
                <div className="flex items-center space-x-3 md:space-x-4 mb-2">
                  <h3 className="text-white text-lg md:text-xl font-bold">{selectedImage.title}</h3>
                  {selectedImage.featured && (
                    <Badge className="bg-yellow-500 text-white text-xs">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                    {getCategoryDisplayName(selectedImage.category)}
                  </Badge>
                </div>
                {selectedImage.description && (
                  <p className="text-white/90 text-sm leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>

            {/* Click outside to close */}
            <div 
              className="absolute inset-0 -z-10" 
              onClick={closeImageModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;