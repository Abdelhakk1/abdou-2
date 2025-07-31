import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const { rows } = await db.query(
        `SELECT co.*, u.full_name, u.email, u.phone,
                pr.id as receipt_id, pr.transaction_number, pr.amount as receipt_amount, 
                pr.receipt_url, pr.notes as receipt_notes, pr.verified as receipt_verified, 
                pr.created_at as receipt_created_at
         FROM course_orders co
         LEFT JOIN users u ON co.user_id = u.id
         LEFT JOIN payment_receipts pr ON co.id = pr.order_id
         ORDER BY co.created_at DESC`
      );
      
      // Group receipts by order
      const ordersMap = new Map();
      rows.forEach((row: any) => {
        if (!ordersMap.has(row.id)) {
          ordersMap.set(row.id, {
            ...row,
            users: {
              full_name: row.full_name,
              email: row.email,
              phone: row.phone
            },
            payment_receipts: []
          });
        }
        if (row.receipt_id) {
          ordersMap.get(row.id).payment_receipts.push({
            id: row.receipt_id,
            transaction_number: row.transaction_number,
            amount: row.receipt_amount,
            receipt_url: row.receipt_url,
            notes: row.receipt_notes,
            verified: row.receipt_verified,
            created_at: row.receipt_created_at
          });
        }
      });
      
      return NextResponse.json(Array.from(ordersMap.values()));
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

      const order = await db.queryOne(
        'UPDATE course_orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      
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