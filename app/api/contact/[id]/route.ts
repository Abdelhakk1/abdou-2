import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdmin(request, async (req, user) => {
    try {
      const { id } = params;
      const data = await req.json();
      const { status, adminNotes } = data;

      const updates: any = { status };
      if (adminNotes !== undefined) {
        updates.admin_notes = adminNotes;
      }

      const { data: message, error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(message);
    } catch (error: any) {
      console.error('Error updating contact message:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update contact message' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdmin(request, async (req, user) => {
    try {
      const { id } = params;
      
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting contact message:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to delete contact message' },
        { status: 500 }
      );
    }
  });
}