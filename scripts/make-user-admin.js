// This script makes an existing user an admin in Supabase
// Run with: node scripts/make-user-admin.js

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Get Supabase credentials from environment variables or provide them here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:8000';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeUserAdmin() {
  try {
    // User ID to make admin
    const userId = '986c5ecd-157b-4e77-8f65-acbc53273f6a';
    
    console.log(`Making user ${userId} an admin...`);
    
    // Check if user already exists in auth
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (userError) {
      console.error('Error checking user:', userError);
      return;
    }
    
    if (!user) {
      console.log(`User with ID ${userId} not found in users table. Creating user record...`);
      
      // Get user from auth.users
      const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId);
      
      if (authUserError || !authUser) {
        console.error('Error getting auth user:', authUserError);
        return;
      }
      
      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: 'abdou@admin.com',
          full_name: authUser.user.user_metadata?.full_name || 'Admin User'
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return;
      }
      
      console.log(`Created user profile for ${userId}`);
    }
    
    // Check if user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (adminCheckError) {
      console.error('Error checking admin status:', adminCheckError);
      return;
    }
    
    if (existingAdmin) {
      console.log(`User ${userId} is already an admin`);
    } else {
      // Make user an admin
      const adminId = uuidv4();
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
          id: adminId,
          user_id: userId,
          role: 'admin'
        });
      
      if (adminError) {
        console.error('Error making user admin:', adminError);
        return;
      }
      
      console.log(`User ${userId} has been made an admin successfully`);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

makeUserAdmin();