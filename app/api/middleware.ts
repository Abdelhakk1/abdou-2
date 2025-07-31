import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await auth.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Call the handler with the authenticated user
    return handler(req, user);
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { message: error.message || 'Authentication error' },
      { status: 401 }
    );
  }
}

export async function withAdmin(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    // First authenticate the user
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await auth.verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = await auth.isAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Call the handler with the authenticated admin user
    return handler(req, user);
  } catch (error: any) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { message: error.message || 'Authentication error' },
      { status: 401 }
    );
  }
}