import { bookingService } from '../services/bookingService.js';

export const bookingController = {
  create(req, res, next) {
    try {
      const booking = bookingService.create({ ...req.body, userId: req.userId });
      res.status(201).json({ booking });
    } catch (error) {
      next(error);
    }
  },
  getMine(req, res, next) {
    try {
      const bookings = bookingService.getMine(req.userId);
      res.json({ bookings });
    } catch (error) {
      next(error);
    }
  },
};
