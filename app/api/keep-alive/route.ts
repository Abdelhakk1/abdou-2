import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// This endpoint will be called by a cron job to keep the database active
export async function GET(request: NextRequest) {
  try {
    // Make a simple query to keep the database active
    const { rows } = await db.query('SELECT COUNT(*) as count FROM system_settings');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection active', 
      timestamp: new Date().toISOString(),
      recordCount: rows[0]?.count || 0
    });
  } catch (error: any) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to ping database',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}