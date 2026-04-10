import { bookingService } from '../services/bookingService.js';

export const paymentController = {
  async pay(req, res, next) {
    try {
      const booking = await bookingService.markPaid({
        bookingId: req.params.bookingId,
        paymentMethod: req.body.paymentMethod,
      });
      res.json({ booking, message: 'Төлбөр амжилттай.' });
    } catch (error) {
      next(error);
    }
  },
};
