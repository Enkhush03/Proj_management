import { Router } from 'express';
import { parkController } from '../controllers/parkController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const parksRouter = Router();
parksRouter.use(requireAuth);
parksRouter.get('/nearby', parkController.getNearby);
parksRouter.get('/', parkController.getAll);
parksRouter.get('/:parkId', parkController.getOne);
