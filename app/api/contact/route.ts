import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const { data: contactMessage, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        subject,
        message,
        status: 'unread'
      })
      .select()
      .single();

    if (error) throw error;

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
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error getting contact messages:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get contact messages' },
      { status: 500 }
    );
  }
}