import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes.js';
import { parksRouter } from './routes/parkRoutes.js';
import { bookingsRouter } from './routes/bookingRoutes.js';
import { paymentsRouter } from './routes/paymentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'smartpark-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/parks', parksRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`SmartPark API ажиллаж байна: http://localhost:${PORT}`);
});
