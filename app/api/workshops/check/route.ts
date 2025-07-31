import { NextRequest, NextResponse } from 'next/server';
import { workshops } from '@/lib/workshops';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const workshopId = searchParams.get('workshopId');
    
    if (!userId || !workshopId) {
      return NextResponse.json(
        { message: 'User ID and workshop ID are required' },
        { status: 400 }
      );
    }
    
    const reservation = await workshops.checkExistingReservation(userId, workshopId);
    return NextResponse.json(reservation || null);
  } catch (error: any) {
    console.error('Error checking existing reservation:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to check existing reservation' },
      { status: 500 }
    );
  }
}