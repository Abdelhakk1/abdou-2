'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cloudinaryConfig } from '@/lib/cloudinary';

interface CloudinaryMultiUploadProps {
  onUploadSuccess: (urls: string[]) => void;
  existingImages?: string[];
  folder?: string;
  buttonText?: string;
  maxFiles?: number;
}

export default function CloudinaryMultiUpload({
  onUploadSuccess,
  existingImages = [],
  folder = 'general',
  buttonText = 'Upload Images',
  maxFiles = 3
}: CloudinaryMultiUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setUploadedImages(existingImages);
    }
  }, [existingImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the maximum
    if (uploadedImages.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} images`);
      return;
    }

    // Validate file size (max 5MB per file)
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        toast.error(`File ${files[i].name} exceeds 5MB limit`);
      } else {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(new Array(validFiles.length).fill(0));
    
    try {
      // Get Cloudinary signature from our API
      const response = await fetch('/api/cloudinary/signature');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get upload signature');
      }
      
      const { signature, timestamp, apiKey } = await response.json();
      
      // Upload each file to Cloudinary
      const uploadPromises = validFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', `soundous_bakes/${folder}`);
        formData.append('resource_type', 'auto');
        
        // Use XHR for progress tracking
        return new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[index] = progress;
                return newProgress;
              });
            }
          });
          
          xhr.onload = function() {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.secure_url);
            } else {
              reject(new Error('Upload failed'));
            }
          };
          
          xhr.onerror = function() {
            reject(new Error('Upload failed'));
          };
          
          xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`);
          xhr.send(formData);
        });
      });
      
      const newImageUrls = await Promise.all(uploadPromises);
      const allImages = [...uploadedImages, ...newImageUrls];
      
      setUploadedImages(allImages);
      onUploadSuccess(allImages);
      toast.success(`${newImageUrls.length} image${newImageUrls.length > 1 ? 's' : ''} uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading to Cloudinary:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
      // Clear the input value to allow uploading the same file again
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    onUploadSuccess(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Preview Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Existing Images */}
        {uploadedImages.map((url, index) => (
          <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
            <img 
              src={url} 
              alt={`Uploaded ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveImage(index)}
                className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Empty Slots */}
        {Array.from({ length: Math.max(0, maxFiles - uploadedImages.length) }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {uploadedImages.length < maxFiles && (
        <div>
          <input
            id="cloudinary-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('cloudinary-upload')?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {buttonText} ({uploadedImages.length}/{maxFiles})
              </>
            )}
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="text-xs">
              <div className="flex justify-between mb-1">
                <span>Uploading image {index + 1}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}