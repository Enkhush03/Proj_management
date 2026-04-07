import { db } from '../data/store.js';
import { AppError } from '../utils/appError.js';

export const parkService = {
  getAll() {
    return db.parks;
  },
  getOne(parkId) {
    const park = db.parks.find((item) => item.id === parkId);
    if (!park) throw new AppError('Зогсоол олдсонгүй.', 404);
    return park;
  },
};
