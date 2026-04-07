import { parkService } from '../services/parkService.js';

export const parkController = {
  getAll(_req, res) {
    res.json({ parks: parkService.getAll() });
  },
  getOne(req, res, next) {
    try {
      const park = parkService.getOne(req.params.parkId);
      res.json({ park });
    } catch (error) {
      next(error);
    }
  },
};
