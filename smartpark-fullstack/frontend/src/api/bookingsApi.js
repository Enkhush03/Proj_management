import { api } from './client';

export const bookingsApi = {
  create: (payload) => api.post('/bookings', payload),
  getMine: () => api.get('/bookings/me'),
  pay: (bookingId, payload) => api.post(`/payments/${bookingId}`, payload),
};
