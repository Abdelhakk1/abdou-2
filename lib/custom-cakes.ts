import { db } from './database';
import { fileUpload } from './file-upload';

export const customCakes = {
  // Create a new custom cake order
  async createOrder(orderData: {
    userId: string;
    name: string;
    phone: string;
    email: string;
    eventDate: string;
    size: string;
    shape: string;
    flavor: string;
    pickupDelivery: string;
    deliveryAddress?: string;
    deliveryTime?: string;
    pickupTime?: string;
    additionalInfo?: string;
    needCandles: boolean;
    inspirationImageUrl?: string;
    // New fields
    instagramUsername?: string;
    location?: string;
    cakeMessage?: string;
    sizeFlavor?: string;
    supplements?: string[];
    topping?: string;
    packaging?: string;
    deliveryOption?: string;
    deliveryLocation?: string;
    cake_type?: string;
  }) {
    try {
      // Extract servings from size string
      const extractServings = (sizeString: string): number => {
        const match = sizeString.match(/\((\d+)-(\d+)\s*parts?\)/i);
        if (match) {
          return parseInt(match[2], 10);
        }
        
        // For new size format (10cm, 12cm, etc.)
        if (sizeString === '10cm') return 6;
        if (sizeString === '12cm') return 12;
        if (sizeString === '15cm') return 18;
        if (sizeString === '20cm') return 30;
        if (sizeString === '25cm') return 50;
        
        const numberMatch = sizeString.match(/(\d+)/);
        return numberMatch ? parseInt(numberMatch[1], 10) : 6;
      };

      const servings = extractServings(orderData.size);
      
      // Create the order
      const data = await db.queryOne(
        `INSERT INTO custom_cake_orders (
          user_id, name, phone, email, event_date, size, shape, cake_type, flavor, 
          pickup_delivery, delivery_address, delivery_time, pickup_time, special_instructions, 
          need_candles, inspiration_image_url, servings, status, instagram_username, location, 
          cake_message, size_flavor, supplements, topping, packaging, delivery_option, delivery_location
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
          $21, $22, $23, $24, $25, $26, $27
        ) RETURNING *`,
        [
          orderData.userId, orderData.name, orderData.phone, orderData.email, orderData.eventDate,
          orderData.size, orderData.shape, orderData.cake_type || `${orderData.size} ${orderData.shape} cake`,
          orderData.flavor, orderData.pickupDelivery, orderData.deliveryAddress || null,
          orderData.deliveryTime || null, orderData.pickupTime || null, orderData.additionalInfo || null,
          orderData.needCandles, orderData.inspirationImageUrl || null, servings, 'pending',
          orderData.instagramUsername || null, orderData.location || null, orderData.cakeMessage || null,
          orderData.sizeFlavor || null, orderData.supplements || [], orderData.topping || null,
          orderData.packaging || null, orderData.deliveryOption || null, orderData.deliveryLocation || null
        ]
      );
      return data;
    } catch (error) {
      console.error('Error creating custom cake order:', error);
      throw error;
    }
  },

  // Get user's cake orders
  async getUserOrders(userId: string) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM custom_cake_orders WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return rows || [];
    } catch (error) {
      console.error('Error getting user cake orders:', error);
      return [];
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled', cancellationReason?: string) {
    try {
      const updates: any = { status };
      if (cancellationReason !== undefined) {
        updates.cancellation_reason = cancellationReason;
      }
      
      const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = Object.values(updates);
      
      const data = await db.queryOne(
        `UPDATE custom_cake_orders SET ${setClause} WHERE id = $1 RETURNING *`,
        [orderId, ...values]
      );
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId: string) {
    try {
      const data = await db.queryOne(
        'SELECT * FROM custom_cake_orders WHERE id = $1',
        [orderId]
      );
      return data;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      throw error;
    }
  }
};