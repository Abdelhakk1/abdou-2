import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { workshops } from '@/lib/workshops';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdmin(request, async (req, user) => {
    try {
      const { id } = params;
      const data = await req.json();
      const { status, cancellationReason } = data;

      const reservation = await workshops.updateReservationStatus(id, status, cancellationReason);
      return NextResponse.json(reservation);
    } catch (error: any) {
      console.error('Error updating workshop reservation:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update workshop reservation' },
        { status: 500 }
      );
    }
  });
}