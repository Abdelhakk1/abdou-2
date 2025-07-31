import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { courses } from '@/lib/courses';

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

      const receipt = await courses.uploadReceipt(file, orderId, {
        transactionNumber,
        amount,
        notes
      });
      
      return NextResponse.json(receipt, { status: 201 });
    } catch (error: any) {
      console.error('Error uploading receipt:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to upload receipt' },
        { status: 500 }
      );
    }
  });
}