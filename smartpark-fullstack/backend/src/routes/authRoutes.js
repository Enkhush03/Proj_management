import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const authRouter = Router();
authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);
authRouter.get('/me', requireAuth, authController.me);
