import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const isConnected = await db.testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Successfully connected to MySQL database'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to MySQL database'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Database connection test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error.message
    }, { status: 500 });
  }
}