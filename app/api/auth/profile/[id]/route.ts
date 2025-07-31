import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const currentUser = await auth.getCurrentUser(token);

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Ensure user can only access their own profile
    if (currentUser.id !== id) {
      // Check if user is admin
      const isUserAdmin = await auth.isAdmin(currentUser.id);
      if (!isUserAdmin) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    // Get user profile
    const user = await auth.getUserProfile(id);
    
    if (!user) {
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
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const currentUser = await auth.getCurrentUser(token);

    if (!currentUser) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Ensure user can only update their own profile
    if (currentUser.id !== id) {
      // Check if user is admin
      const isUserAdmin = await auth.isAdmin(currentUser.id);
      if (!isUserAdmin) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    const updates = await request.json();

    // Update user profile
    const updatedUser = await auth.updateProfile(id, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update user profile' },
      { status: 500 }
    );
  }
}