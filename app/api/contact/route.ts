import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Insert contact message
    const contactMessage = await db.queryOne(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, phone, subject, message, 'unread']
    );

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to submit contact message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { rows } = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    
    return NextResponse.json(rows || []);
  } catch (error: any) {
    console.error('Error getting contact messages:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get contact messages' },
      { status: 500 }
    );
  }
}