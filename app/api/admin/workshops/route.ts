import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const workshops = await db.query('SELECT * FROM workshop_schedules ORDER BY date ASC');
    return NextResponse.json(workshops);
  } catch (error: any) {
    console.error('Error getting workshop schedules:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get workshop schedules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      workshopName, workshopType, description, date, startTime, endTime,
      maxParticipants, price, discountPrice, location, notes, imageUrl 
    } = data;
    
    // Validate required fields
    if (!workshopName || !workshopType || !date || !startTime || !endTime || !price) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const id = uuidv4();
    
    await db.query(
      `INSERT INTO workshop_schedules (
        id, workshop_name, workshop_type, description, date, start_time, end_time,
        max_participants, price, discount_price, location, notes, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        workshopName,
        workshopType,
        description,
        date,
        startTime,
        endTime,
        maxParticipants || 4,
        price,
        discountPrice || null,
        location || 'shop',
        notes || null,
        imageUrl || null
      ]
    );
    
    const workshop = await db.queryOne('SELECT * FROM workshop_schedules WHERE id = ?', [id]);
    return NextResponse.json(workshop, { status: 201 });
  } catch (error: any) {
    console.error('Error creating workshop schedule:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create workshop schedule' },
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
        { message: 'Workshop ID is required' },
        { status: 400 }
      );
    }
    
    const allowedFields = [
      'workshop_name', 'workshop_type', 'description', 'date', 'start_time', 'end_time',
      'max_participants', 'price', 'discount_price', 'location', 'notes', 'image_url', 'status'
    ];
    
    const updateFields = [];
    const updateValues = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
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
      `UPDATE workshop_schedules SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    const workshop = await db.queryOne('SELECT * FROM workshop_schedules WHERE id = ?', [id]);
    return NextResponse.json(workshop);
  } catch (error: any) {
    console.error('Error updating workshop schedule:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update workshop schedule' },
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
        { message: 'Workshop ID is required' },
        { status: 400 }
      );
    }
    
    await db.delete('DELETE FROM workshop_schedules WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting workshop schedule:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to delete workshop schedule' },
      { status: 500 }
    );
  }
}