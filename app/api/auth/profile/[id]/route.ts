import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, currentUser) => {
    try {
      const { id } = params;
      
      // Ensure user can only access their own profile
      if (currentUser.id !== id) {
        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();
          
        if (adminError || !adminData) {
          return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 403 }
          );
        }
      }

      // Get user profile
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user profile' },
        { status: 500 }
      );
    }
  });
}