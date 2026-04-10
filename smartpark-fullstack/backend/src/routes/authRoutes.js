import { Router } from 'express';
import { login, register, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/signup', register);
authRouter.get('/me', requireAuth, me);