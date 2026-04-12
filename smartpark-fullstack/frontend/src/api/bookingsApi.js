import { api } from './client';

export const bookingsApi = {
  create: (payload) => api.post('/api/bookings', payload),
  getMine: () => api.get('/api/bookings/me'),
  pay: (bookingId, payload) => api.post(`/api/payments/${bookingId}`, payload),
};
