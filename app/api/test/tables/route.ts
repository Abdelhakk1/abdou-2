import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const tables = await db.query(`
      SELECT table_name as name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_DATABASE || 'soundous_bakes']);
    
    const tableNames = tables.map((row: any) => row.name);

    return NextResponse.json({
      success: true,
      message: `Found ${tableNames.length} tables`,
      tables: tableNames
    });
  } catch (error: any) {
    console.error('Table check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check database tables',
      error: error.message
    }, { status: 500 });
  }
}