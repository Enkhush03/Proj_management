import { Router } from 'express';
import { bookingController } from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const bookingsRouter = Router();
bookingsRouter.use(requireAuth);
bookingsRouter.post('/', bookingController.create);
bookingsRouter.get('/me', bookingController.getMine);
