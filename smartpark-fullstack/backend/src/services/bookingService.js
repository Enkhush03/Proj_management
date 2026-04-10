import { withTransaction, query } from '../config/db.js';
import { AppError } from '../utils/appError.js';
import { createId } from '../utils/id.js';

const SERVICE_FEE = 200;

export const bookingService = {
  async create({ userId, parkId, hours, vehiclePlate }) {
    return withTransaction(async (client) => {
      const { rows: parks } = await client.query(
        `SELECT id, name, hourly_rate AS "hourlyRate", available_slots AS "availableSlots"
         FROM parks WHERE id = $1 FOR UPDATE`,
        [parkId],
      );
      const park = parks[0];
      if (!park) throw new AppError('Зогсоол олдсонгүй.', 404);
      if (park.availableSlots <= 0) throw new AppError('Сул зогсоол байхгүй байна.', 400);

      const total = park.hourlyRate * hours + SERVICE_FEE;
      const booking = {
        id: createId('book'),
        userId,
        parkId,
        parkName: park.name,
        hours,
        vehiclePlate,
        total,
        status: 'CREATED',
        createdAt: new Date().toISOString(),
      };

      await client.query(
        `INSERT INTO bookings (id, user_id, park_id, park_name, hours, vehicle_plate, total, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          booking.id,
          booking.userId,
          booking.parkId,
          booking.parkName,
          booking.hours,
          booking.vehiclePlate,
          booking.total,
          booking.status,
          booking.createdAt,
        ],
      );

      await client.query('UPDATE parks SET available_slots = available_slots - 1, updated_at = NOW() WHERE id = $1', [parkId]);
      return booking;
    });
  },

  async getMine(userId) {
    const { rows } = await query(
      `SELECT
        id,
        user_id AS "userId",
        park_id AS "parkId",
        park_name AS "parkName",
        hours,
        vehicle_plate AS "vehiclePlate",
        total,
        status,
        created_at AS "createdAt"
       FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },

  async markPaid({ bookingId, paymentMethod }) {
    return withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT id, total, status,
            user_id AS "userId",
            park_id AS "parkId",
            park_name AS "parkName",
            hours,
            vehicle_plate AS "vehiclePlate",
            created_at AS "createdAt"
         FROM bookings WHERE id = $1 FOR UPDATE`,
        [bookingId],
      );
      const booking = rows[0];
      if (!booking) throw new AppError('Захиалга олдсонгүй.', 404);
      if (booking.status === 'PAID') {
        const { rows: existingPayments } = await client.query(
          'SELECT payment_method AS "paymentMethod", amount, paid_at AS "paidAt" FROM payments WHERE booking_id = $1 LIMIT 1',
          [bookingId],
        );
        return { ...booking, status: 'PAID', payment: existingPayments[0] || null };
      }

      await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['PAID', bookingId]);
      const payment = {
        id: createId('pay'),
        bookingId,
        paymentMethod,
        amount: booking.total,
      };

      await client.query(
        'INSERT INTO payments (id, booking_id, payment_method, amount) VALUES ($1, $2, $3, $4)',
        [payment.id, payment.bookingId, payment.paymentMethod, payment.amount],
      );

      return { ...booking, status: 'PAID', payment };
    });
  },
};
