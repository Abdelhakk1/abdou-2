import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from './cloudinary';

export const fileUpload = {
  // Upload to Cloudinary
  async uploadToCloudinary(file: File, folder: string): Promise<string> {
    try {
      // Convert File to base64
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64data, {
        folder: `soundous_bakes/${folder}`,
        resource_type: 'auto',
        format: 'webp',
        quality: 80,
        transformation: [
          { width: 1200, crop: "limit" }
        ]
      });

      return result.secure_url;
    } catch (error) {
      console.error(`Error uploading to Cloudinary (${folder}):`, error);
      throw error;
    }
  },

  // Upload gallery image
  async uploadGalleryImage(file: File): Promise<string> {
    try {
      return await this.uploadToCloudinary(file, 'gallery');
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      throw error;
    }
  },

  // Upload workshop image
  async uploadWorkshopImage(file: File): Promise<string> {
    try {
      return await this.uploadToCloudinary(file, 'workshop-images');
    } catch (error) {
      console.error('Error uploading workshop image:', error);
      throw error;
    }
  },

  // Upload receipt
  async uploadReceipt(file: File, userId: string): Promise<string> {
    try {
      return await this.uploadToCloudinary(file, `receipts/${userId}`);
    } catch (error) {
      console.error('Error uploading receipt:', error);
      throw error;
    }
  },

  // Upload inspiration image
  async uploadInspirationImage(file: File, userId: string): Promise<string> {
    try {
      return await this.uploadToCloudinary(file, `inspiration-images/${userId}`);
    } catch (error) {
      console.error('Error uploading inspiration image:', error);
      throw error;
    }
  },

  // Upload course image
  async uploadCourseImage(file: File): Promise<string> {
    try {
      return await this.uploadToCloudinary(file, 'course-images');
    } catch (error) {
      console.error('Error uploading course image:', error);
      throw error;
    }
  }
};