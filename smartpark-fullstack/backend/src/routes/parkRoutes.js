import { Router } from 'express';
import { parkController } from '../controllers/parkController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const parksRouter = Router();
parksRouter.get('/', requireAuth, parkController.getAll);
parksRouter.get('/:parkId', requireAuth, parkController.getOne);
