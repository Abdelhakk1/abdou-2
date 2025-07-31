'use client';

import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  user: User;
  access_token: string;
  expires_at?: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session from localStorage
    const getInitialSession = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with server
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const currentUser = await response.json();
            setUser(currentUser);
            setSession({
              user: currentUser,
              access_token: token,
              expires_at: Date.now() + 3600000 // 1 hour from now
            });
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(user);
        setSession({
          user,
          access_token: token,
          expires_at: Date.now() + 3600000
        });
        return { user, error: null };
      } else {
        const error = await response.json();
        return { user: null, error: new Error(error.message || 'Sign in failed') };
      }
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(user);
        setSession({
          user,
          access_token: token,
          expires_at: Date.now() + 3600000
        });
        return { user, error: null };
      } else {
        const error = await response.json();
        return { user: null, error: new Error(error.message || 'Sign up failed') };
      }
    } catch (error) {
      return { user: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('authToken');
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const getUserProfile = async (userId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const response = await fetch(`/api/auth/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  const updateProfile = async (userId: string, updates: Partial<User>) => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const response = await fetch(`/api/auth/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  };

  const isAdmin = async (userId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const response = await fetch('/api/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    getUserProfile,
    updateProfile,
    isAdmin
  };
}