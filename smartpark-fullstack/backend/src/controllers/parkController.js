import { parkService } from '../services/parkService.js';

function parseOptionalNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const parkController = {
  async getAll(req, res, next) {
    try {
      const lat = parseOptionalNumber(req.query.lat);
      const lng = parseOptionalNumber(req.query.lng);
      const radiusKm = parseOptionalNumber(req.query.radiusKm);
      const maxHourlyRate = parseOptionalNumber(req.query.maxHourlyRate);
      const minAvailableSlots = parseOptionalNumber(req.query.minAvailableSlots);
      const parks = await parkService.getAll({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots });
      res.json({ parks });
    } catch (error) {
      next(error);
    }
  },

  async getNearby(req, res, next) {
    try {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);
      const radiusKm = parseOptionalNumber(req.query.radiusKm) || 5;
      const maxHourlyRate = parseOptionalNumber(req.query.maxHourlyRate);
      const minAvailableSlots = parseOptionalNumber(req.query.minAvailableSlots);
      const parks = await parkService.getNearby({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots });
      res.json({ parks, center: { lat, lng }, radiusKm, filters: { maxHourlyRate, minAvailableSlots } });
    } catch (error) {
      next(error);
    }
  },

  async getOne(req, res, next) {
    try {
      const park = await parkService.getOne(req.params.parkId);
      res.json({ park });
    } catch (error) {
      next(error);
    }
  },
};
