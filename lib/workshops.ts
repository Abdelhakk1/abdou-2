import { db } from './database';

export const workshops = {
  // Check if user already has a pending reservation for this workshop
  async checkExistingReservation(userId: string, workshopId: string) {
    try {
      const data = await db.queryOne(
        'SELECT * FROM workshop_reservations WHERE user_id = $1 AND workshop_id = $2 AND status = $3',
        [userId, workshopId, 'pending']
      );
      return data;
    } catch (error) {
      console.error('Error checking existing reservation:', error);
      return null;
    }
  },

  // Create a new workshop reservation
  async createReservation(reservationData: {
    userId: string;
    workshopId: string;
    workshopName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    participants: number;
    ageGroup: 'adults' | 'children' | 'mixed';
    location: string;
    preferredDate: string;
    additionalInfo?: string;
  }) {
    try {
      // Check if user already has a pending reservation for this workshop
      const existingReservation = await this.checkExistingReservation(
        reservationData.userId, 
        reservationData.workshopId
      );

      if (existingReservation) {
        throw new Error('You already have a pending reservation for this workshop. Please wait for admin confirmation or cancellation before submitting a new reservation.');
      }
      
      // Create the reservation
      const data = await db.queryOne(
        `INSERT INTO workshop_reservations (
          user_id, workshop_id, workshop_name, first_name, last_name, phone, email, 
          participants, age_group, location, preferred_date, additional_info, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING *`,
        [
          reservationData.userId, reservationData.workshopId, reservationData.workshopName,
          reservationData.firstName, reservationData.lastName, reservationData.phone,
          reservationData.email, reservationData.participants, reservationData.ageGroup,
          reservationData.location === 'shop' ? 'shop' : 'elsewhere', reservationData.preferredDate,
          reservationData.additionalInfo || null, 'pending'
        ]
      );
      return data;
    } catch (error) {
      console.error('Error creating workshop reservation:', error);
      throw error;
    }
  },

  // Get user's reservations
  async getUserReservations(userId: string) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM workshop_reservations WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return rows || [];
    } catch (error) {
      console.error('Error getting user workshop reservations:', error);
      return [];
    }
  },

  // Update reservation status with optional cancellation reason
  async updateReservationStatus(reservationId: string, status: 'pending' | 'confirmed' | 'cancelled', cancellationReason?: string) {
    try {
      const updates: any = { status };
      if (status === 'cancelled' && cancellationReason) {
        updates.cancellation_reason = cancellationReason;
      }
      
      const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
      const values = Object.values(updates);
      
      const data = await db.queryOne(
        `UPDATE workshop_reservations SET ${setClause} WHERE id = $1 RETURNING *`,
        [reservationId, ...values]
      );
      return data;
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  },

  // Get reservation by ID
  async getReservationById(reservationId: string) {
    try {
      const data = await db.queryOne(
        'SELECT * FROM workshop_reservations WHERE id = $1',
        [reservationId]
      );
      return data;
    } catch (error) {
      console.error('Error getting reservation by ID:', error);
      throw error;
    }
  }
};