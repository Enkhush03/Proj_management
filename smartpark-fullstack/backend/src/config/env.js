import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:51_3',
  usePostgis: process.env.USE_POSTGIS === 'true',
  fallbackLat: Number(process.env.FALLBACK_LAT || 47.918873),
  fallbackLng: Number(process.env.FALLBACK_LNG || 106.917583),
};
