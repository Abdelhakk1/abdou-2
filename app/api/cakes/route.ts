import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { fileUpload } from '@/lib/file-upload';
import { customCakes } from '@/lib/custom-cakes';

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

      // Create order using the custom cakes service
      const order = await customCakes.createOrder({
        userId: user.id,
        name,
        phone,
        email,
        eventDate,
        size,
        shape,
        flavor,
        pickupDelivery,
        deliveryAddress,
        deliveryTime,
        pickupTime,
        additionalInfo,
        needCandles,
        inspirationImageUrl,
        cake_type: `${size} ${shape} cake`,
      });

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
      const orders = await customCakes.getUserOrders(user.id);
      return NextResponse.json(orders || []);
    } catch (error: any) {
      console.error('Error getting user cake orders:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user cake orders' },
        { status: 500 }
      );
    }
  });
}