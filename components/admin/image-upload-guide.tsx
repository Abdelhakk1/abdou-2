"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Camera, Folder, CheckCircle } from 'lucide-react';

export default function ImageUploadGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          How to Add Your Client's Cake Photos
        </h1>
        <p className="text-foreground/70 text-lg">
          Multiple easy ways to showcase your beautiful cake creations
        </p>
      </div>

      {/* Method 1: Admin Gallery Upload */}
      <Card className="soft-shadow bg-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Upload className="h-6 w-6 mr-3 text-green-600" />
            Method 1: Admin Gallery Upload (Recommended)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Best for: Regular updates and organized gallery</h3>
            <p className="text-green-700 text-sm">
              Perfect for ongoing management of your cake portfolio with proper categorization.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80">
              <li>Go to <code className="bg-gray-100 px-2 py-1 rounded">/admin</code> (admin dashboard)</li>
              <li>Click on "Gallery Management"</li>
              <li>Click "Add New Item"</li>
              <li>Upload your cake photos one by one</li>
              <li>Add titles, descriptions, and categorize them</li>
              <li>Mark special cakes as "Featured"</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Categories Available:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• <strong>Custom Cakes</strong> - Individual client orders</li>
              <li>• <strong>Workshop Photos</strong> - Students' creations</li>
              <li>• <strong>Behind the Scenes</strong> - Process photos</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Method 2: Direct File Replacement */}
      <Card className="soft-shadow bg-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Image className="h-6 w-6 mr-3 text-blue-600" />
            Method 2: Direct Image Replacement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">✅ Best for: Quick updates to existing sections</h3>
            <p className="text-blue-700 text-sm">
              Replace placeholder images with your actual cake photos instantly.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Current Placeholder Locations:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <h5 className="font-medium">Hero Section</h5>
                <p className="text-sm text-foreground/70">Main cake image on homepage</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                  components/hero-section.tsx
                </code>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-medium">Featured Cakes</h5>
                <p className="text-sm text-foreground/70">4 category showcase images</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                  components/featured-cakes.tsx
                </code>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-medium">Newsletter Section</h5>
                <p className="text-sm text-foreground/70">Background cake image</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                  components/newsletter-section.tsx
                </code>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-medium">About Page</h5>
                <p className="text-sm text-foreground/70">Timeline and profile images</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                  app/about/page.tsx
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Method 3: Bulk Upload */}
      <Card className="soft-shadow bg-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Folder className="h-6 w-6 mr-3 text-purple-600" />
            Method 3: Send Photos to Developer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">✅ Best for: Large collections or initial setup</h3>
            <p className="text-purple-700 text-sm">
              Send me your photos and I'll integrate them professionally into the website.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">What to Send:</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>High-quality cake photos (preferably 1200px+ width)</li>
              <li>Brief descriptions for each photo</li>
              <li>Category preferences (custom cakes, workshops, etc.)</li>
              <li>Which photos should be "featured"</li>
              <li>Any specific placement requests</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">📸 Photo Tips:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Use good lighting (natural light works best)</li>
              <li>• Clean, uncluttered backgrounds</li>
              <li>• Multiple angles of the same cake</li>
              <li>• Include detail shots of decorations</li>
              <li>• Process photos (before/during/after)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Image Requirements */}
      <Card className="soft-shadow bg-gray-50 border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
            Image Requirements & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Technical Requirements:</h4>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>• <strong>Format:</strong> JPG, PNG, or WebP</li>
                <li>• <strong>Size:</strong> Max 15MB per image</li>
                <li>• <strong>Dimensions:</strong> Minimum 800px width</li>
                <li>• <strong>Aspect Ratio:</strong> 4:3 or 16:9 preferred</li>
                <li>• <strong>Quality:</strong> High resolution for best results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Content Guidelines:</h4>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>• Showcase your best work</li>
                <li>• Include variety in styles and occasions</li>
                <li>• Show different cake sizes and shapes</li>
                <li>• Include workshop/teaching moments</li>
                <li>• Behind-the-scenes process shots</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center bg-primary/10 rounded-lg p-8">
        <h3 className="text-xl font-bold text-foreground mb-4">
          Ready to Showcase Your Beautiful Cakes?
        </h3>
        <p className="text-foreground/70 mb-6">
          Choose the method that works best for you, or let me know if you'd like help with any of these approaches.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="btn-primary">
            Access Admin Dashboard
          </Button>
          <Button className="btn-outline">
            Send Photos to Developer
          </Button>
        </div>
      </div>
    </div>
  );
}