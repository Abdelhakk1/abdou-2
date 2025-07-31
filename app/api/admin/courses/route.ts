import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const courses = await db.query('SELECT * FROM online_courses ORDER BY created_at DESC');
    
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      title, description, price, discountPrice, durationHours, moduleCount,
      imageUrl, googleDriveLink, features, modules 
    } = data;
    
    // Validate required fields
    if (!title || !description || !price) {
      return NextResponse.json(
        { message: 'Title, description, and price are required' },
        { status: 400 }
      );
    }
    
    const id = uuidv4();
    
    await db.query(
      `INSERT INTO online_courses (
        id, title, description, price, discount_price, duration_hours, module_count,
        image_url, google_drive_link, features, modules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        description,
        price,
        discountPrice || null,
        durationHours || null,
        moduleCount || null,
        imageUrl || null,
        googleDriveLink || null,
        JSON.stringify(features || []),
        JSON.stringify(modules || [])
      ]
    );
    
    const course = await db.queryOne('SELECT * FROM online_courses WHERE id = ?', [id]);
    
    // Parse JSON strings to objects for response
    const formattedCourse = {
      ...course,
      features: course.features ? JSON.parse(course.features) : [],
      modules: course.modules ? JSON.parse(course.modules) : []
    };
    
    return NextResponse.json(formattedCourse, { status: 201 });
  } catch (error: any) {
    console.error('Error creating online course:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create online course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updates } = data;
    
    if (!id) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    const allowedFields = [
      'title', 'description', 'price', 'discount_price', 'duration_hours', 'module_count',
      'image_url', 'google_drive_link', 'status', 'features', 'modules'
    ];
    
    const updateFields = [];
    const updateValues = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'features' || key === 'modules') {
          updateFields.push(`${key} = ?`);
          updateValues.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { message: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    updateValues.push(id);
    
    await db.update(
      `UPDATE online_courses SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    const course = await db.queryOne('SELECT * FROM online_courses WHERE id = ?', [id]);
    
    // Parse JSON strings to objects for response
    const formattedCourse = {
      ...course,
      features: course.features ? JSON.parse(course.features) : [],
      modules: course.modules ? JSON.parse(course.modules) : []
    };
    
    return NextResponse.json(formattedCourse);
  } catch (error: any) {
    console.error('Error updating online course:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update online course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    await db.delete('DELETE FROM online_courses WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting online course:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete online course' },
      { status: 500 }
    );
  }
}