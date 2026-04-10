import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes.js';
import { parksRouter } from './routes/parkRoutes.js';
import { bookingsRouter } from './routes/bookingRoutes.js';
import { paymentsRouter } from './routes/paymentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { checkDbConnection } from './config/db.js';
import { env } from './config/env.js';

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.get('/health', async (_req, res, next) => {
  try {
    await checkDbConnection();
    res.json({ ok: true, service: 'smartpark-api', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRouter);
app.use('/api/parks', parksRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use(errorHandler);

app.listen(env.port, async () => {
  try {
    await checkDbConnection();
    console.log(`SmartPark API ажиллаж байна: http://localhost:${env.port}`);
  } catch (error) {
    console.error('PostgreSQL холболт амжилтгүй:', error.message);
  }
});

