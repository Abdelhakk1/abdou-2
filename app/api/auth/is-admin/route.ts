import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const isAdmin = await auth.isAdmin(user.id);
      return NextResponse.json({ isAdmin });
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to check admin status' },
        { status: 500 }
      );
    }
  });
}