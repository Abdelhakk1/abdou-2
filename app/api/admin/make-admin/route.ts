import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await db.queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user is already an admin
    const existingAdmin = await db.queryOne(
      'SELECT id FROM admin_users WHERE user_id = ?',
      [user.id]
    );
    
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'User is already an admin' },
        { status: 400 }
      );
    }
    
    // Make user an admin
    const adminId = uuidv4();
    await db.query(
      'INSERT INTO admin_users (id, user_id, role) VALUES (?, ?, ?)',
      [adminId, user.id, 'admin']
    );
    
    return NextResponse.json({
      message: 'User has been made an admin successfully',
      adminId,
      userId: user.id
    });
  } catch (error: any) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to make user admin' },
      { status: 500 }
    );
  }
}