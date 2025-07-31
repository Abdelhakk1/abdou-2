import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { courses } from '@/lib/courses';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const data = await req.json();
      
      // Validate required fields
      if (!data.courseName || !data.amount || !data.paymentMethod || !data.name || !data.email || !data.phone) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        );
      }

      const order = await courses.createOrder({
        userId: user.id,
        courseName: data.courseName,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      
      return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
      console.error('Error creating course order:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create course order' },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const orders = await courses.getUserOrders(user.id);
      return NextResponse.json(orders || []);
    } catch (error: any) {
      console.error('Error getting user course orders:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user course orders' },
        { status: 500 }
      );
    }
  });
}