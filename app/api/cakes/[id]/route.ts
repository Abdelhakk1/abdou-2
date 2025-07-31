import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, withAuth } from '@/app/api/middleware';
import { customCakes } from '@/lib/custom-cakes';
import { auth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdmin(request, async (req, user) => {
    try {
      const { id } = params;
      const data = await req.json();
      const { status, cancellationReason } = data;

      const order = await customCakes.updateOrderStatus(id, status, cancellationReason);
      return NextResponse.json(order);
    } catch (error: any) {
      console.error('Error updating cake order:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update cake order' },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    try {
      const { id } = params;
      
      const order = await customCakes.getOrderById(id);
      
      if (!order) {
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Check if user is authorized to view this order
      if (order.user_id !== user.id) {
        // Check if user is admin
        const isUserAdmin = await auth.isAdmin(user.id);
        if (!isUserAdmin) {
          return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 403 }
          );
        }
      }
      
      return NextResponse.json(order);
    } catch (error: any) {
      console.error('Error getting cake order:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get cake order' },
        { status: 500 }
      );
    }
  });
}