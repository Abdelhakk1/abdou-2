import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const workshopId = searchParams.get('workshopId');
    
    if (!userId || !workshopId) {
      return NextResponse.json(
        { message: 'User ID and workshop ID are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('workshop_reservations')
      .select('id, status')
      .eq('user_id', userId)
      .eq('workshop_id', workshopId)
      .eq('status', 'pending')
      .maybeSingle();
    
    if (error) throw error;
    return NextResponse.json(data || null);
  } catch (error: any) {
    console.error('Error checking existing reservation:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to check existing reservation' },
      { status: 500 }
    );
  }
}