import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { rows: items } = await db.query(
      'SELECT * FROM gallery_items ORDER BY display_order ASC, created_at DESC'
    );
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error getting gallery items:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get gallery items' },
      { status: 500 }
    );
  }
}