import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const workshops = await db.query(
      'SELECT * FROM workshop_schedules WHERE status = "active" ORDER BY date ASC'
    );
    return NextResponse.json(workshops);
  } catch (error: any) {
    console.error('Error getting workshop schedules:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get workshop schedules' },
      { status: 500 }
    );
  }
}