import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { supabase } from '@/lib/supabase';
import { fileUpload } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const orderId = formData.get('orderId') as string;
      const transactionNumber = formData.get('transactionNumber') as string;
      const amount = formData.get('amount') as string;
      const notes = formData.get('notes') as string;
      
      if (!file || !orderId || !transactionNumber || !amount) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Get order to verify user ID
      const { data: order, error: orderError } = await supabase
        .from('course_orders')
        .select('user_id')
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;
      
      // Upload receipt to Cloudinary
      const receiptUrl = await fileUpload.uploadReceipt(file, user.id);
      
      // Create receipt record
      const { data, error } = await supabase
        .from('payment_receipts')
        .insert({
          order_id: orderId,
          transaction_number: transactionNumber,
          amount: amount,
          receipt_url: receiptUrl,
          notes: notes || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update order status to 'paid'
      const { error: updateError } = await supabase
        .from('course_orders')
        .update({ status: 'paid' })
        .eq('id', orderId);
      
      if (updateError) throw updateError;
      
      return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
      console.error('Error uploading receipt:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to upload receipt' },
        { status: 500 }
      );
    }
  });
}