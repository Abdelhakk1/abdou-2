import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/app/api/middleware';
import { courses } from '@/lib/courses';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const courseAccess = await courses.getUserCourseAccess(user.id);
      return NextResponse.json(courseAccess || []);
    } catch (error: any) {
      console.error('Error getting user course access:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get user course access' },
        { status: 500 }
      );
    }
  });
}