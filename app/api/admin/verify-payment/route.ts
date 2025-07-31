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
      const receipt = await db.queryOne(
        `SELECT pr.*, co.id as order_id, co.user_id, co.course_name
         FROM payment_receipts pr
         JOIN course_orders co ON pr.order_id = co.id
         WHERE pr.id = $1`,
        [receiptId]
      );

      if (!receipt) {
        return NextResponse.json(
          { message: 'Receipt not found' },
          { status: 404 }
        );
      }

      // Get the course details to find the Google Drive link
      const course = await db.queryOne(
        'SELECT google_drive_link FROM online_courses WHERE title = $1 AND status = $2',
        [receipt.course_name, 'active']
      );

      if (!course || !course.google_drive_link) {
        throw new Error('Course not found or Google Drive link not set');
      }

      // Verify payment
      await db.queryOne(
        `UPDATE payment_receipts 
         SET verified = true, verified_at = NOW(), verified_by = $1 
         WHERE id = $2 
         RETURNING *`,
        [user.id, receiptId]
      );

      // Update order status
      await db.queryOne(
        'UPDATE course_orders SET status = $1 WHERE id = $2 RETURNING *',
        ['verified', receipt.order_id]
      );

      // Grant course access
      const accessData = await db.queryOne(
        `INSERT INTO course_access (user_id, order_id, course_name, google_drive_link)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [receipt.user_id, receipt.order_id, receipt.course_name, course.google_drive_link]
      );

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