import { db } from './database';

export const contact = {
  // Submit a new contact message
  async submitMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    try {
      const data = await db.queryOne(
        `INSERT INTO contact_messages (name, email, phone, subject, message, status) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [messageData.name, messageData.email, messageData.phone || null, messageData.subject, messageData.message, 'unread']
      );
      return data;
    } catch (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }
  },

  // Admin: Get all contact messages
  async getAllMessages() {
    try {
      const { rows } = await db.query(
        'SELECT * FROM contact_messages ORDER BY created_at DESC'
      );
      return rows || [];
    } catch (error) {
      console.error('Error getting contact messages:', error);
      return [];
    }
  },

  // Admin: Update message status
  async updateMessageStatus(messageId: string, status: 'unread' | 'read' | 'replied', adminNotes?: string) {
    try {
      const updates: any = { status };
      if (adminNotes !== undefined) {
        updates.admin_notes = adminNotes;
      }
      
      const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = Object.values(updates);
      
      const data = await db.queryOne(
        `UPDATE contact_messages SET ${setClause} WHERE id = $1 RETURNING *`,
        [messageId, ...values]
      );
      return data;
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  },

  // Admin: Delete message
  async deleteMessage(messageId: string) {
    try {
      await db.queryOne(
        'DELETE FROM contact_messages WHERE id = $1 RETURNING *',
        [messageId]
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};