import { db } from '../data/store.js';
import { AppError } from '../utils/appError.js';
import { createId } from '../utils/id.js';

const SERVICE_FEE = 200;

export const bookingService = {
  create({ userId, parkId, hours, vehiclePlate }) {
    const park = db.parks.find((item) => item.id === parkId);
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

    park.availableSlots -= 1;
    db.bookings.push(booking);
    return booking;
  },

  getMine(userId) {
    return db.bookings.filter((item) => item.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  markPaid({ bookingId, paymentMethod }) {
    const booking = db.bookings.find((item) => item.id === bookingId);
    if (!booking) throw new AppError('Захиалга олдсонгүй.', 404);

    booking.status = 'PAID';
    db.payments.push({
      id: createId('pay'),
      bookingId,
      paymentMethod,
      amount: booking.total,
      paidAt: new Date().toISOString(),
    });

    return booking;
  },
};
