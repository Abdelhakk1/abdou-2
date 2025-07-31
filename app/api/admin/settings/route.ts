import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    
    if (error) throw error;
    return NextResponse.json(data || []);
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

      const { data: setting, error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: value,
          updated_by: user.id
        })
        .eq('setting_key', key)
        .select()
        .single();
      
      if (error) throw error;
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