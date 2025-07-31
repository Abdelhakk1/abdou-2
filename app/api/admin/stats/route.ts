import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/app/api/middleware';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  return withAdmin(request, async (req, user) => {
    try {
      // Get course orders stats
      const { data: courseOrders, error: courseOrdersError } = await supabase
        .from('course_orders')
        .select('id, status');
      
      if (courseOrdersError) throw courseOrdersError;

      // Get cake orders stats
      const { data: cakeOrders, error: cakeOrdersError } = await supabase
        .from('custom_cake_orders')
        .select('id, status');
      
      if (cakeOrdersError) throw cakeOrdersError;

      // Get workshop reservations stats
      const { data: workshopReservations, error: workshopReservationsError } = await supabase
        .from('workshop_reservations')
        .select('id, status');
      
      if (workshopReservationsError) throw workshopReservationsError;

      // Get gallery items stats
      const { data: galleryItems, error: galleryItemsError } = await supabase
        .from('gallery_items')
        .select('id');
      
      if (galleryItemsError) throw galleryItemsError;

      // Get contact messages stats
      const { data: contactMessages, error: contactMessagesError } = await supabase
        .from('contact_messages')
        .select('id, status');
        
      if (contactMessagesError) throw contactMessagesError;

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