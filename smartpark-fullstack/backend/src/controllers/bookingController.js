import { bookingService } from '../services/bookingService.js';

export const bookingController = {
  async create(req, res, next) {
    try {
      const booking = await bookingService.create({ ...req.body, userId: req.userId });
      res.status(201).json({ booking });
    } catch (error) {
      next(error);
    }
  },
  async getMine(req, res, next) {
    try {
      const bookings = await bookingService.getMine(req.userId);
      res.json({ bookings });
    } catch (error) {
      next(error);
    }
  },
};
