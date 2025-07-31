import { db } from './database';
import { fileUpload } from './file-upload';

export const courses = {
  // Create a new course order
  async createOrder(orderData: {
    userId: string;
    courseName: string;
    amount: number;
    paymentMethod: 'baridimob' | 'ccp';
    name: string;
    email: string;
    phone: string;
  }) {
    try {
      const data = await db.queryOne(
        `INSERT INTO course_orders (user_id, course_name, amount, payment_method) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [orderData.userId, orderData.courseName, orderData.amount, orderData.paymentMethod]
      );
      return data;
    } catch (error) {
      console.error('Error creating course order:', error);
      throw error;
    }
  },

  // Upload payment receipt
  async uploadReceipt(file: File, orderId: string, receiptData: {
    transactionNumber: string;
    amount: string;
    notes?: string;
  }) {
    try {
      // Get order to verify user ID
      const order = await db.queryOne(
        'SELECT user_id FROM course_orders WHERE id = $1',
        [orderId]
      );
      
      if (!order) throw new Error('Order not found');
      
      // Upload receipt to Cloudinary
      const receiptUrl = await fileUpload.uploadReceipt(file, order.user_id);
      
      // Create receipt record
      const data = await db.queryOne(
        `INSERT INTO payment_receipts (order_id, transaction_number, amount, receipt_url, notes) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [orderId, receiptData.transactionNumber, receiptData.amount, receiptUrl, receiptData.notes || null]
      );
      
      // Update order status to 'paid'
      await db.queryOne(
        'UPDATE course_orders SET status = $1 WHERE id = $2 RETURNING *',
        ['paid', orderId]
      );
      
      return data;
    } catch (error) {
      console.error('Error uploading receipt:', error);
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId: string) {
    try {
      const { rows } = await db.query(
        `SELECT co.*, pr.* 
         FROM course_orders co 
         LEFT JOIN payment_receipts pr ON co.id = pr.order_id 
         WHERE co.user_id = $1 
         ORDER BY co.created_at DESC`,
        [userId]
      );
      
      // Group receipts by order
      const ordersMap = new Map();
      rows.forEach((row: any) => {
        if (!ordersMap.has(row.id)) {
          ordersMap.set(row.id, {
            ...row,
            payment_receipts: []
          });
        }
        if (row.receipt_id) {
          ordersMap.get(row.id).payment_receipts.push({
            id: row.receipt_id,
            transaction_number: row.transaction_number,
            amount: row.amount,
            receipt_url: row.receipt_url,
            notes: row.notes,
            created_at: row.receipt_created_at
          });
        }
      });
      
      return Array.from(ordersMap.values());
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  },

  // Get user's course access
  async getUserCourseAccess(userId: string) {
    try {
      const { rows } = await db.query(
        `SELECT ca.*, co.course_name, co.amount 
         FROM course_access ca 
         JOIN course_orders co ON ca.order_id = co.id 
         WHERE ca.user_id = $1 
         ORDER BY ca.created_at DESC`,
        [userId]
      );
      return rows || [];
    } catch (error) {
      console.error('Error getting user course access:', error);
      return [];
    }
  }
};