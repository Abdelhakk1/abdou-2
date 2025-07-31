import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const { data, error } = await supabase
        .from('course_orders')
        .select(`
          *,
          users:user_id (
            full_name,
            email,
            phone
          ),
          payment_receipts (
            id,
            transaction_number,
            amount,
            receipt_url,
            notes,
            verified,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return NextResponse.json(data || []);
    } catch (error: any) {
      console.error('Error getting course orders:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get course orders' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const data = await req.json();
      const { id, status } = data;
      
      if (!id || !status) {
        return NextResponse.json(
          { message: 'Order ID and status are required' },
          { status: 400 }
        );
      }

      const { data: order, error } = await supabase
        .from('course_orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json(order);
    } catch (error: any) {
      console.error('Error updating course order status:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update course order status' },
        { status: 500 }
      );
    }
  });
}