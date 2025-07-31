import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get manual unavailable dates
    const { rows: manualDates } = await db.query(
      'SELECT id, date, reason, \'manual\' as type FROM unavailable_dates'
    );
    
    // Get dates with existing confirmed/in-progress orders
    const { rows: bookedDates } = await db.query(
      'SELECT event_date as date, \'Already booked\' as reason, \'booked\' as type FROM custom_cake_orders WHERE status IN (\'confirmed\', \'in_progress\')'
    );
    
    // Combine and sort dates
    const allDates = [...manualDates, ...bookedDates].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return NextResponse.json(allDates);
  } catch (error: any) {
    console.error('Error getting unavailable dates:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get unavailable dates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const data = await req.json();
      const { date, reason } = data;
      
      if (!date) {
        return NextResponse.json(
          { message: 'Date is required' },
          { status: 400 }
        );
      }
      
      const unavailableDate = await db.queryOne(
        'INSERT INTO unavailable_dates (date, reason, created_by) VALUES ($1, $2, $3) RETURNING *',
        [date, reason || 'Unavailable', user.id]
      );
      
      return NextResponse.json(unavailableDate, { status: 201 });
    } catch (error: any) {
      console.error('Error adding unavailable date:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to add unavailable date' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return NextResponse.json(
          { message: 'Date ID is required' },
          { status: 400 }
        );
      }
      
      await db.queryOne('DELETE FROM unavailable_dates WHERE id = $1 RETURNING *', [id]);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error removing unavailable date:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to remove unavailable date' },
        { status: 500 }
      );
    }
  });
}