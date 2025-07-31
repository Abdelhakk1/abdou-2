import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { data, error } = await supabase
        .from('course_access')
        .select('*')
        .eq('user_id', user.id)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    } catch (error: any) {
      console.error('Error getting user course access:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user course access' },
        { status: 500 }
      );
    }
  });
}