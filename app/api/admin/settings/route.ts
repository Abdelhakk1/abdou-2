import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (key) {
      // Get specific setting
      const setting = await db.queryOne(
        'SELECT * FROM system_settings WHERE setting_key = $1',
        [key]
      );
      return NextResponse.json(setting);
    } else {
      // Get all settings
      const { rows } = await db.query('SELECT * FROM system_settings');
      return NextResponse.json(rows || []);
    }
  } catch (error: any) {
    console.error('Error getting system settings:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get system settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const data = await req.json();
      const { key, value } = data;
      
      if (!key) {
        return NextResponse.json(
          { message: 'Setting key is required' },
          { status: 400 }
        );
      }

      const setting = await db.queryOne(
        `UPDATE system_settings 
         SET setting_value = $1, updated_by = $2 
         WHERE setting_key = $3 
         RETURNING *`,
        [value, user.id, key]
      );
      
      return NextResponse.json(setting);
    } catch (error: any) {
      console.error('Error updating system setting:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update system setting' },
        { status: 500 }
      );
    }
  });
}