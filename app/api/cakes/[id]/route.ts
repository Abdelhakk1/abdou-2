import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, withAuth } from '@/app/api/middleware';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdmin(request, async (req, user) => {
    try {
      const { id } = params;
      const data = await req.json();
      const { status, cancellationReason } = data;

      const updates: any = { status };
      if (status === 'cancelled' && cancellationReason) {
        updates.cancellation_reason = cancellationReason;
      }

      const { data: order, error } = await supabase
        .from('custom_cake_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
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
      
      const { data: order, error } = await supabase
        .from('custom_cake_orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Check if user is authorized to view this order
      if (order.user_id !== user.id) {
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (adminError || !adminData) {
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