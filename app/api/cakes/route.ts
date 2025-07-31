import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { supabase } from '@/lib/supabase';
import { fileUpload } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const formData = await req.formData();
      
      // Extract form data
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const eventDate = formData.get('eventDate') as string;
      const size = formData.get('size') as string;
      const shape = formData.get('shape') as string;
      const flavor = formData.get('flavor') as string;
      const pickupDelivery = formData.get('pickupDelivery') as string;
      const deliveryAddress = formData.get('deliveryAddress') as string;
      const deliveryTime = formData.get('deliveryTime') as string;
      const pickupTime = formData.get('pickupTime') as string;
      const additionalInfo = formData.get('additionalInfo') as string;
      const needCandles = formData.get('needCandles') === 'true';
      const inspirationImage = formData.get('inspirationImage') as File;
      
      // Validate required fields
      if (!name || !phone || !email || !eventDate || !size || !shape || !flavor || !pickupDelivery) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Upload inspiration image if provided
      let inspirationImageUrl = null;
      if (inspirationImage && inspirationImage.size > 0) {
        inspirationImageUrl = await fileUpload.uploadInspirationImage(inspirationImage, user.id);
      }

      // Extract servings from size string
      const extractServings = (sizeString: string): number => {
        const match = sizeString.match(/\((\d+)-(\d+)\s*parts?\)/i);
        if (match) {
          return parseInt(match[2], 10);
        }
        
        // For new size format (10cm, 12cm, etc.)
        if (sizeString === '10cm') return 6;
        if (sizeString === '12cm') return 12;
        if (sizeString === '15cm') return 18;
        if (sizeString === '20cm') return 30;
        if (sizeString === '25cm') return 50;
        
        const numberMatch = sizeString.match(/(\d+)/);
        return numberMatch ? parseInt(numberMatch[1], 10) : 6;
      };

      const servings = extractServings(size);

      // Create order in database
      const { data: order, error } = await supabase
        .from('custom_cake_orders')
        .insert({
          user_id: user.id,
          name,
          phone,
          email,
          event_date: eventDate,
          size,
          shape,
          cake_type: `${size} ${shape} cake`,
          flavor,
          pickup_delivery: pickupDelivery,
          delivery_address: deliveryAddress || null,
          delivery_time: deliveryTime || null,
          pickup_time: pickupTime || null,
          special_instructions: additionalInfo || null,
          need_candles: needCandles,
          inspiration_image_url: inspirationImageUrl,
          servings
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
      console.error('Error creating cake order:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create cake order' },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { data, error } = await supabase
        .from('custom_cake_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return NextResponse.json(data || []);
    } catch (error: any) {
      console.error('Error getting user cake orders:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user cake orders' },
        { status: 500 }
      );
    }
  });
}