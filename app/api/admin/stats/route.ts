import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      // Get course orders stats
      const { rows: courseOrders } = await db.query(
        'SELECT id, status FROM course_orders'
      );

      // Get cake orders stats
      const { rows: cakeOrders } = await db.query(
        'SELECT id, status FROM custom_cake_orders'
      );

      // Get workshop reservations stats
      const { rows: workshopReservations } = await db.query(
        'SELECT id, status FROM workshop_reservations'
      );

      // Get gallery items stats
      const { rows: galleryItems } = await db.query(
        'SELECT id FROM gallery_items'
      );

      // Get contact messages stats
      const { rows: contactMessages } = await db.query(
        'SELECT id, status FROM contact_messages'
      );

      const stats = {
        totalCourseOrders: courseOrders?.length || 0,
        pendingCourseOrders: courseOrders?.filter(o => o.status === 'pending' || o.status === 'paid').length || 0,
        totalCakeOrders: cakeOrders?.length || 0,
        pendingCakeOrders: cakeOrders?.filter(o => o.status === 'pending').length || 0,
        totalWorkshopReservations: workshopReservations?.length || 0,
        pendingWorkshopReservations: workshopReservations?.filter(r => r.status === 'pending').length || 0,
        totalGalleryItems: galleryItems?.length || 0,
        totalContactMessages: contactMessages?.length || 0,
        unreadContactMessages: contactMessages?.filter(m => m.status === 'unread').length || 0,
      };
      
      return NextResponse.json(stats);
    } catch (error: any) {
      console.error('Error getting dashboard stats:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to get dashboard stats' },
        { status: 500 }
      );
    }
  });
}