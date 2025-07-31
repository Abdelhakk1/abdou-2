import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

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

      const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = Object.values(updates);

      const message = await db.queryOne(
        `UPDATE contact_messages SET ${setClause} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );

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
      
      await db.queryOne(
        'DELETE FROM contact_messages WHERE id = $1 RETURNING *',
        [id]
      );

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