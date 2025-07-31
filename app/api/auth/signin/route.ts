import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with local auth
    const { user, token } = await auth.signIn(email, password);

    return NextResponse.json({ user, token });
  } catch (error: any) {
    console.error('Signin API error:', error);
    return NextResponse.json(
      { message: error.message || 'Invalid credentials' },
      { status: 401 }
    );
  }
}