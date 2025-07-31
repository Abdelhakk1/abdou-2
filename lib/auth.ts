import { db } from './database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

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

export const auth = {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  },

  async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },

  async signUp(email: string, password: string, fullName: string, phone?: string) {
    const hashedPassword = await this.hashPassword(password);
    const user = await db.queryOne(
      'INSERT INTO users (email, password_hash, full_name, phone) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, phone, created_at, updated_at',
      [email, hashedPassword, fullName, phone]
    );
    return user;
  },

  async signIn(email: string, password: string) {
    const user = await db.queryOne('SELECT * FROM users WHERE email = $1', [email]);
    if (!user || !await this.comparePasswords(password, user.password_hash)) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  },

  async signOut() {
    // For JWT-based auth, we just return success as the client handles token removal
    return { error: null };
  },

  async getCurrentUser(token: string): Promise<User | null> {
    const decoded = this.verifyToken(token);
    if (!decoded || typeof decoded === 'string') return null;
    
    const user = await db.queryOne(
      'SELECT id, email, full_name, phone, created_at, updated_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    return user;
  },

  async getUserProfile(userId: string) {
    const user = await db.queryOne(
      'SELECT id, email, full_name, phone, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );
    return user;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.full_name) {
      fields.push(`full_name = $${paramCount++}`);
      values.push(updates.full_name);
    }
    if (updates.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(updates.phone);
    }

    if (fields.length === 0) return null;

    values.push(userId);
    const user = await db.queryOne(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, email, full_name, phone, created_at, updated_at`,
      values
    );
    return user;
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  async isAdmin(userId: string) {
    const admin = await db.queryOne('SELECT * FROM admin_users WHERE user_id = $1', [userId]);
    return !!admin;
  },

  // Mock Supabase auth interface for compatibility
  auth: {
    getSession: async () => {
      // This would need to be implemented based on how you're storing the session
      // For now, return null as the client should handle session management
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      // This is a simplified mock - in a real implementation you'd need to handle auth state changes
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};
