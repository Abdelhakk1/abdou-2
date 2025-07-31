"use client";

import { useState } from 'react';
import { AdminDashboard, GalleryManagement, WorkshopManagement, CourseManagement, CakeOrdersManagement, CourseOrdersManagement, WorkshopReservationsManagement, ContactMessagesManagement, UnavailableDatesManagement } from '@/components/admin-dashboard-design';

export default function AdminDesignPage() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'gallery':
        return <GalleryManagement />;
      case 'workshops':
        return <WorkshopManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'cake-orders':
        return <CakeOrdersManagement />;
      case 'course-orders':
        return <CourseOrdersManagement />;
      case 'workshop-reservations':
        return <WorkshopReservationsManagement />;
      case 'messages':
        return <ContactMessagesManagement />;
      case 'unavailable-dates':
        return <UnavailableDatesManagement />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard Design</h1>
          <p className="text-foreground/70">
            This is a demonstration of the admin dashboard UI design. Select different views below.
          </p>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg ${activeView === 'dashboard' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveView('gallery')}
            className={`px-4 py-2 rounded-lg ${activeView === 'gallery' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Gallery
          </button>
          <button 
            onClick={() => setActiveView('workshops')}
            className={`px-4 py-2 rounded-lg ${activeView === 'workshops' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Workshops
          </button>
          <button 
            onClick={() => setActiveView('courses')}
            className={`px-4 py-2 rounded-lg ${activeView === 'courses' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Courses
          </button>
          <button 
            onClick={() => setActiveView('cake-orders')}
            className={`px-4 py-2 rounded-lg ${activeView === 'cake-orders' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Cake Orders
          </button>
          <button 
            onClick={() => setActiveView('course-orders')}
            className={`px-4 py-2 rounded-lg ${activeView === 'course-orders' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Course Orders
          </button>
          <button 
            onClick={() => setActiveView('workshop-reservations')}
            className={`px-4 py-2 rounded-lg ${activeView === 'workshop-reservations' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Workshop Reservations
          </button>
          <button 
            onClick={() => setActiveView('messages')}
            className={`px-4 py-2 rounded-lg ${activeView === 'messages' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Contact Messages
          </button>
          <button 
            onClick={() => setActiveView('unavailable-dates')}
            className={`px-4 py-2 rounded-lg ${activeView === 'unavailable-dates' ? 'bg-foreground text-background' : 'border-2 border-foreground text-foreground'}`}
          >
            Unavailable Dates
          </button>
        </div>
        
        {renderView()}
      </div>
    </div>
  );
}