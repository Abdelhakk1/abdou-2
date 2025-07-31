import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This endpoint will be called by a cron job to keep Supabase active
export async function GET(request: NextRequest) {
  try {
    // Validate Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    // Make a simple query to keep the database active
    // Use system_settings table instead of users table to avoid RLS issues
    const { data, error } = await supabase
      .from('system_settings')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection active', 
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to ping Supabase',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}