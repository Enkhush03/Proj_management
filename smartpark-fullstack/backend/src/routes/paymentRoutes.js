import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const paymentsRouter = Router();
paymentsRouter.use(requireAuth);
paymentsRouter.post('/:bookingId', paymentController.pay);
