import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { workshops } from '@/lib/workshops';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const data = await req.json();
      
      // Validate required fields
      const requiredFields = ['workshopId', 'workshopName', 'firstName', 'lastName', 'phone', 'email', 'participants', 'ageGroup', 'location', 'preferredDate'];
      for (const field of requiredFields) {
        if (!data[field]) {
          return NextResponse.json(
            { message: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const reservation = await workshops.createReservation({
        userId: user.id,
        workshopId: data.workshopId,
        workshopName: data.workshopName,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        participants: parseInt(data.participants),
        ageGroup: data.ageGroup,
        location: data.location,
        preferredDate: data.preferredDate,
        additionalInfo: data.additionalInfo,
      });
      
      return NextResponse.json(reservation, { status: 201 });
    } catch (error: any) {
      console.error('Error creating workshop reservation:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create workshop reservation' },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const reservations = await workshops.getUserReservations(user.id);
      return NextResponse.json(reservations || []);
    } catch (error: any) {
      console.error('Error getting user workshop reservations:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user workshop reservations' },
        { status: 500 }
      );
    }
  });
}