import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const data = await req.json();
      const { receiptId } = data;
      
      if (!receiptId) {
        return NextResponse.json(
          { message: 'Receipt ID is required' },
          { status: 400 }
        );
      }

      // Get receipt and order details
      const { data: receipt, error: receiptError } = await supabase
        .from('payment_receipts')
        .select(`
          *,
          course_orders!inner (
            id,
            user_id,
            course_name
          )
        `)
        .eq('id', receiptId)
        .single();

      if (receiptError) throw receiptError;

      // Get the course details to find the Google Drive link
      const { data: course, error: courseError } = await supabase
        .from('online_courses')
        .select('google_drive_link')
        .eq('title', receipt.course_orders.course_name)
        .eq('status', 'active')
        .single();

      if (courseError) throw courseError;

      if (!course || !course.google_drive_link) {
        throw new Error('Course not found or Google Drive link not set');
      }

      // Verify payment
      const { error: updateError } = await supabase
        .from('payment_receipts')
        .update({ 
          verified: true,
          verified_at: new Date().toISOString(),
          verified_by: user.id
        })
        .eq('id', receiptId);

      if (updateError) throw updateError;

      // Update order status
      const { error: orderError } = await supabase
        .from('course_orders')
        .update({ status: 'verified' })
        .eq('id', receipt.course_orders.id);

      if (orderError) throw orderError;

      // Grant course access
      const { data: accessData, error: accessError } = await supabase
        .from('course_access')
        .insert({
          user_id: receipt.course_orders.user_id,
          order_id: receipt.course_orders.id,
          course_name: receipt.course_orders.course_name,
          google_drive_link: course.google_drive_link
        })
        .select()
        .single();

      if (accessError) throw accessError;

      return NextResponse.json(accessData);
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to verify payment' },
        { status: 500 }
      );
    }
  });
}