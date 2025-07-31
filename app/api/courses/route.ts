import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { rows: courses } = await db.query(
      'SELECT * FROM online_courses WHERE status = $1 ORDER BY created_at DESC',
      ['active']
    );
    
    // Parse JSON strings to objects
    const formattedCourses = courses.map((course: any) => ({
      ...course,
      features: course.features ? JSON.parse(course.features) : [],
      modules: course.modules ? JSON.parse(course.modules) : []
    }));
    
    return NextResponse.json(formattedCourses);
  } catch (error: any) {
    console.error('Error getting online courses:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get online courses' },
      { status: 500 }
    );
  }
}