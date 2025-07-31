import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { rows: data } = await db.query(
      'SELECT * FROM gallery_items ORDER BY display_order ASC, created_at DESC'
    );
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error getting gallery items:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to get gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const data = await req.json();
      
      const item = await db.queryOne(
        `INSERT INTO gallery_items (title, description, image_url, category, featured, display_order, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [data.title, data.description || null, data.imageUrl, data.category, data.featured || false, data.displayOrder || 0, user.id]
      );
      
      return NextResponse.json(item, { status: 201 });
    } catch (error: any) {
      console.error('Error creating gallery item:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to create gallery item' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const data = await req.json();
      const { id, ...updates } = data;
      
      if (!id) {
        return NextResponse.json(
          { message: 'Gallery item ID is required' },
          { status: 400 }
        );
      }

      const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = Object.values(updates);
      
      const item = await db.queryOne(
        `UPDATE gallery_items SET ${setClause} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return NextResponse.json(item);
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to update gallery item' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return NextResponse.json(
          { message: 'Gallery item ID is required' },
          { status: 400 }
        );
      }

      await db.queryOne(
        'DELETE FROM gallery_items WHERE id = $1 RETURNING *',
        [id]
      );
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to delete gallery item' },
        { status: 500 }
      );
    }
  });
}