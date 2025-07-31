// This script makes all existing users admins in Supabase
// Run with: node scripts/make-all-users-admin.js

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Get Supabase credentials from environment variables or provide them here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:8000';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAllUsersAdmin() {
  try {
    console.log('Fetching all users...');
    
    // Get all users from auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return;
    }
    
    console.log(`Found ${authUsers.users.length} users in auth system`);
    
    // Process each user
    for (const authUser of authUsers.users) {
      console.log(`Processing user: ${authUser.email} (${authUser.id})`);
      
      // Check if user exists in users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();
      
      if (profileError) {
        console.error(`Error checking profile for user ${authUser.id}:`, profileError);
        continue;
      }
      
      // Create user profile if it doesn't exist
      if (!userProfile) {
        console.log(`Creating profile for user ${authUser.id}`);
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email || 'unknown@example.com',
            full_name: authUser.user_metadata?.full_name || 'User',
            phone: authUser.user_metadata?.phone || null
          });
        
        if (insertError) {
          console.error(`Error creating profile for user ${authUser.id}:`, insertError);
          continue;
        }
      }
      
      // Check if user is already an admin
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      if (adminCheckError) {
        console.error(`Error checking admin status for user ${authUser.id}:`, adminCheckError);
        continue;
      }
      
      if (existingAdmin) {
        console.log(`User ${authUser.id} is already an admin`);
      } else {
        // Make user an admin
        const adminId = uuidv4();
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            id: adminId,
            user_id: authUser.id,
            role: 'admin'
          });
        
        if (adminError) {
          console.error(`Error making user ${authUser.id} admin:`, adminError);
          continue;
        }
        
        console.log(`User ${authUser.id} has been made an admin successfully`);
      }
    }
    
    console.log('\nAll users have been processed!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

makeAllUsersAdmin();