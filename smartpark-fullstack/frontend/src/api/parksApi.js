import { api } from './client';

export const parksApi = {
  getAll: () => api.get('/parks'),
  getOne: (parkId) => api.get(`/parks/${parkId}`),
};
