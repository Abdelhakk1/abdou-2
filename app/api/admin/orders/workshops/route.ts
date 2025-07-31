import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const reservations = await workshopsMySQL.getAllReservations();
      return NextResponse.json(reservations);
    } catch (error: any) {
      console.error('Error getting workshop reservations:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get workshop reservations' },
        { status: 500 }
      );
    }
  });
}