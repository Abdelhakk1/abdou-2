-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (must be first due to foreign key dependencies)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    phone text,
    password_hash VARCHAR(255),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create course_orders table
CREATE TABLE IF NOT EXISTS course_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    course_name text NOT NULL,
    amount integer NOT NULL,
    payment_method text NOT NULL CHECK (payment_method IN ('baridimob', 'ccp')),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'verified', 'cancelled')),
    cancellation_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create payment_receipts table
CREATE TABLE IF NOT EXISTS payment_receipts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES course_orders(id) ON DELETE CASCADE,
    transaction_number text NOT NULL,
    amount text NOT NULL,
    receipt_url text NOT NULL,
    notes text,
    verified boolean DEFAULT false,
    verified_at timestamptz,
    verified_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create course_access table
CREATE TABLE IF NOT EXISTS course_access (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    order_id uuid REFERENCES course_orders(id) ON DELETE CASCADE,
    course_name text NOT NULL,
    google_drive_link text NOT NULL,
    granted_at timestamptz DEFAULT now(),
    expires_at timestamptz
);

-- Create workshop_schedules table
CREATE TABLE IF NOT EXISTS workshop_schedules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_name text NOT NULL,
    workshop_type text NOT NULL CHECK (workshop_type IN ('pinterest', 'decorating', 'complete')),
    description text,
    date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    max_participants integer NOT NULL DEFAULT 4,
    current_participants integer DEFAULT 0,
    price integer NOT NULL,
    discount_price integer,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    location text DEFAULT 'shop',
    notes text,
    image_url text,
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create workshop_reservations table
CREATE TABLE IF NOT EXISTS workshop_reservations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    workshop_id uuid REFERENCES workshop_schedules(id) ON DELETE CASCADE,
    workshop_name text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    preferred_date date,
    location text NOT NULL CHECK (location IN ('shop', 'elsewhere')),
    custom_address text,
    participants integer NOT NULL,
    age_group text NOT NULL CHECK (age_group IN ('adults', 'children', 'mixed')),
    additional_info text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    cancellation_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create custom_cake_orders table
CREATE TABLE IF NOT EXISTS custom_cake_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    event_date date NOT NULL,
    servings integer,
    cake_type text,
    flavor text,
    customization text,
    special_instructions text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    pickup_delivery text CHECK (pickup_delivery IN ('pickup', 'delivery')),
    delivery_address text,
    delivery_time text,
    pickup_time text,
    size text,
    shape text CHECK (shape IN ('circle', 'heart', 'square', 'rectangle')),
    need_candles boolean DEFAULT false,
    inspiration_image_url text,
    cancellation_reason text,
    instagram_username text,
    location text,
    cake_message text,
    size_flavor text,
    supplements text[],
    topping text,
    packaging text,
    delivery_option text,
    delivery_location text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create cake_orders table
CREATE TABLE IF NOT EXISTS cake_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    cake_type text NOT NULL,
    size text NOT NULL,
    flavor text NOT NULL,
    filling text,
    frosting text,
    decorations text,
    custom_message text,
    delivery_date date NOT NULL,
    delivery_address text NOT NULL,
    phone_number text NOT NULL,
    special_instructions text,
    price decimal(10,2) NOT NULL DEFAULT 0.00,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    category text NOT NULL CHECK (category IN ('cakes', 'workshops', 'behind-scenes', 'wedding')),
    featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create online_courses table
CREATE TABLE IF NOT EXISTS online_courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    discount_price integer,
    duration_hours integer,
    module_count integer,
    image_url text,
    google_drive_link text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    features jsonb DEFAULT '[]'::jsonb,
    modules jsonb DEFAULT '[]'::jsonb,
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    permissions jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key text UNIQUE NOT NULL,
    setting_value boolean NOT NULL DEFAULT true,
    description text,
    updated_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create unavailable_dates table
CREATE TABLE IF NOT EXISTS unavailable_dates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL UNIQUE,
    reason text,
    created_by uuid REFERENCES users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Wait a moment to ensure all tables are created
DO $$ BEGIN
    PERFORM pg_sleep(0.1);
END $$;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('custom_orders_open', true, 'Whether custom cake orders are currently being accepted'),
('workshop_reservations_open', true, 'Whether workshop reservations are currently being accepted'),
('wedding_orders_open', true, 'Whether wedding cake orders are currently being accepted')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create all triggers for updated_at
DO $$
BEGIN
    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    DROP TRIGGER IF EXISTS update_course_orders_updated_at ON course_orders;
    DROP TRIGGER IF EXISTS update_payment_receipts_updated_at ON payment_receipts;
    DROP TRIGGER IF EXISTS update_workshop_reservations_updated_at ON workshop_reservations;
    DROP TRIGGER IF EXISTS update_custom_cake_orders_updated_at ON custom_cake_orders;
    DROP TRIGGER IF EXISTS update_cake_orders_updated_at ON cake_orders;
    DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON gallery_items;
    DROP TRIGGER IF EXISTS update_workshop_schedules_updated_at ON workshop_schedules;
    DROP TRIGGER IF EXISTS update_online_courses_updated_at ON online_courses;
    DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
    DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
    DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
    DROP TRIGGER IF EXISTS update_unavailable_dates_updated_at ON unavailable_dates;
    
    -- Create triggers
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_course_orders_updated_at BEFORE UPDATE ON course_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_payment_receipts_updated_at BEFORE UPDATE ON payment_receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_workshop_reservations_updated_at BEFORE UPDATE ON workshop_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_custom_cake_orders_updated_at BEFORE UPDATE ON custom_cake_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_cake_orders_updated_at BEFORE UPDATE ON cake_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_workshop_schedules_updated_at BEFORE UPDATE ON workshop_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_online_courses_updated_at BEFORE UPDATE ON online_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER update_unavailable_dates_updated_at BEFORE UPDATE ON unavailable_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Create all indexes
DO $$
BEGIN
    -- Create indexes only if tables exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_orders') THEN
        CREATE INDEX IF NOT EXISTS idx_course_orders_user_id ON course_orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_course_orders_status ON course_orders(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_receipts') THEN
        CREATE INDEX IF NOT EXISTS idx_payment_receipts_order_id ON payment_receipts(order_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_access') THEN
        CREATE INDEX IF NOT EXISTS idx_course_access_user_id ON course_access(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workshop_reservations') THEN
        CREATE INDEX IF NOT EXISTS idx_workshop_reservations_user_id ON workshop_reservations(user_id);
        CREATE INDEX IF NOT EXISTS idx_workshop_reservations_status ON workshop_reservations(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_cake_orders') THEN
        CREATE INDEX IF NOT EXISTS idx_custom_cake_orders_user_id ON custom_cake_orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_custom_cake_orders_status ON custom_cake_orders(status);
        CREATE INDEX IF NOT EXISTS idx_custom_cake_orders_event_date ON custom_cake_orders(event_date);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cake_orders') THEN
        CREATE INDEX IF NOT EXISTS idx_cake_orders_user_id ON cake_orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_cake_orders_status ON cake_orders(status);
        CREATE INDEX IF NOT EXISTS idx_cake_orders_delivery_date ON cake_orders(delivery_date);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery_items') THEN
        CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
        CREATE INDEX IF NOT EXISTS idx_gallery_items_featured ON gallery_items(featured);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workshop_schedules') THEN
        CREATE INDEX IF NOT EXISTS idx_workshop_schedules_date ON workshop_schedules(date);
        CREATE INDEX IF NOT EXISTS idx_workshop_schedules_status ON workshop_schedules(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'online_courses') THEN
        CREATE INDEX IF NOT EXISTS idx_online_courses_status ON online_courses(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_messages') THEN
        CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_settings') THEN
        CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'unavailable_dates') THEN
        CREATE INDEX IF NOT EXISTS idx_unavailable_dates_date ON unavailable_dates(date);
    END IF;
END $$;
