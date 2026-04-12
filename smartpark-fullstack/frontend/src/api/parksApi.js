import { api } from './client';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  if (params.lat != null) query.set('lat', String(params.lat));
  if (params.lng != null) query.set('lng', String(params.lng));
  if (params.radiusKm != null) query.set('radiusKm', String(params.radiusKm));
  if (params.maxHourlyRate != null && params.maxHourlyRate !== '') query.set('maxHourlyRate', String(params.maxHourlyRate));
  if (params.minAvailableSlots != null && params.minAvailableSlots !== '') query.set('minAvailableSlots', String(params.minAvailableSlots));
  return query.toString();
}

export const parksApi = {
  getAll: (params = {}) => {
    const query = buildQuery(params);
    return api.get(`/api/parks${query ? `?${query}` : ''}`);
  },
  getNearby: ({ lat, lng, radiusKm = 5, maxHourlyRate, minAvailableSlots }) => {
    const query = buildQuery({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots });
    return api.get(`/api/parks/nearby?${query}`);
  },
  getOne: (parkId) => api.get(`/api/parks/${parkId}`),
};
