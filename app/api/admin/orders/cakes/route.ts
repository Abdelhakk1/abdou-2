import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const orders = await customCakesMySQL.getAllOrders();
      return NextResponse.json(orders);
    } catch (error: any) {
      console.error('Error getting cake orders:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get cake orders' },
        { status: 500 }
      );
    }
  });
}