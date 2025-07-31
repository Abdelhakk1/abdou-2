# Project Context: Soundous Bakes Shop

This document provides context for the Soundous Bakes Shop web application, specifically regarding its database schema and migration to a self-hosted PostgreSQL environment.

## Database Setup

The project has been migrated from a Supabase-hosted database to a local, self-hosted PostgreSQL instance running in Docker. The complete and correct database schema is defined in the `schema.sql` file in the project root.

### Key Details:

*   **Database Type:** PostgreSQL
*   **Schema Definition:** The canonical source of truth for the database schema is `schema.sql`.
*   **Local Connection:** The application connects to the local PostgreSQL server using the credentials and configuration found in `lib/supabase.ts` (which now configures a `pg` Pool).

### Main Tables

The database consists of several tables to manage the bake shop's operations:

*   `users`: Stores user profile information.
*   `course_orders`: Manages orders for online courses.
*   `payment_receipts`: Tracks payment receipts for order verification.
*   `course_access`: Grants access to courses after payment.
*   `workshop_schedules`: Defines the schedule for available workshops.
*   `workshop_reservations`: Manages user reservations for workshops.
*   `custom_cake_orders`: Handles detailed orders for custom cakes.
*   `cake_orders`: A separate, simplified table for general cake orders.
*   `gallery_items`: Manages the photo gallery, including categories like cakes, workshops, and wedding cakes.
*   `online_courses`: Contains details for the online courses offered.
*   `admin_users`: Manages user roles and permissions for the admin dashboard.
*   `contact_messages`: Stores submissions from the contact form.
*   `system_settings`: A key-value store for application-wide settings (e.g., enabling/disabling orders).
*   `unavailable_dates`: Allows admins to block out dates for custom orders.

### Important Notes for Development:

*   **No More Supabase-Specific Features:** The schema has been stripped of all Supabase-specific features like RLS (Row Level Security) policies, `auth.uid()` functions, and direct calls to Supabase storage. All authorization and business logic is now handled within the Next.js application code.
*   **Triggers:** The `updated_at` timestamp on all tables is automatically updated by a PostgreSQL trigger.
*   **Local Authentication:** The `users` table includes a `password_hash` column to support a local authentication strategy, replacing Supabase Auth.
