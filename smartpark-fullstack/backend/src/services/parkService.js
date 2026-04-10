import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

const BASE_SELECT = `
  SELECT
    id,
    name,
    address,
    latitude,
    longitude,
    hourly_rate AS "hourlyRate",
    daily_rate AS "dailyRate",
    available_slots AS "availableSlots",
    total_slots AS "totalSlots",
    features
  FROM parks
`;

export const parkService = {
  async getAll({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots }) {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return this.getNearby({ lat, lng, radiusKm: radiusKm || 5, maxHourlyRate, minAvailableSlots });
    }

    const clauses = [];
    const params = [];

    if (Number.isFinite(maxHourlyRate)) {
      params.push(maxHourlyRate);
      clauses.push(`hourly_rate <= $${params.length}`);
    }

    if (Number.isFinite(minAvailableSlots)) {
      params.push(minAvailableSlots);
      clauses.push(`available_slots >= $${params.length}`);
    }

    const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await query(`${BASE_SELECT} ${whereSql} ORDER BY name ASC`, params);
    return rows;
  },

  async getNearby({ lat, lng, radiusKm = 5, maxHourlyRate, minAvailableSlots }) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new AppError('Байршлын координат буруу байна.', 400);
    }

    if (env.usePostgis) {
      return this.getNearbyWithPostgis({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots });
    }

    return this.getNearbyWithHaversine({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots });
  },

  async getOne(parkId) {
    const { rows } = await query(`${BASE_SELECT} WHERE id = $1 LIMIT 1`, [parkId]);
    const park = rows[0];
    if (!park) throw new AppError('Зогсоол олдсонгүй.', 404);
    return park;
  },

  async getNearbyWithHaversine({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots }) {
    const params = [lat, lng, radiusKm];
    const filters = [];

    if (Number.isFinite(maxHourlyRate)) {
      params.push(maxHourlyRate);
      filters.push(`hourly_rate <= $${params.length}`);
    }

    if (Number.isFinite(minAvailableSlots)) {
      params.push(minAvailableSlots);
      filters.push(`available_slots >= $${params.length}`);
    }

    const filterSql = filters.length ? `AND ${filters.join(' AND ')}` : '';

    const { rows } = await query(
      `
      SELECT
        id,
        name,
        address,
        latitude,
        longitude,
        hourly_rate AS "hourlyRate",
        daily_rate AS "dailyRate",
        available_slots AS "availableSlots",
        total_slots AS "totalSlots",
        features,
        ROUND((6371 * ACOS(
          COS(RADIANS($1)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS($2)) +
          SIN(RADIANS($1)) * SIN(RADIANS(latitude))
        ))::numeric, 2) AS "distanceKm"
      FROM parks
      WHERE (6371 * ACOS(
          COS(RADIANS($1)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS($2)) +
          SIN(RADIANS($1)) * SIN(RADIANS(latitude))
      )) <= $3
      ${filterSql}
      ORDER BY "distanceKm" ASC, available_slots DESC
      `,
      params,
    );
    return rows;
  },

  async getNearbyWithPostgis({ lat, lng, radiusKm, maxHourlyRate, minAvailableSlots }) {
    const params = [lng, lat, radiusKm * 1000];
    const filters = [];

    if (Number.isFinite(maxHourlyRate)) {
      params.push(maxHourlyRate);
      filters.push(`hourly_rate <= $${params.length}`);
    }

    if (Number.isFinite(minAvailableSlots)) {
      params.push(minAvailableSlots);
      filters.push(`available_slots >= $${params.length}`);
    }

    const filterSql = filters.length ? `AND ${filters.join(' AND ')}` : '';

    const { rows } = await query(
      `
      SELECT
        id,
        name,
        address,
        latitude,
        longitude,
        hourly_rate AS "hourlyRate",
        daily_rate AS "dailyRate",
        available_slots AS "availableSlots",
        total_slots AS "totalSlots",
        features,
        ROUND((ST_DistanceSphere(ST_MakePoint(longitude, latitude), ST_MakePoint($1, $2)) / 1000)::numeric, 2) AS "distanceKm"
      FROM parks
      WHERE ST_DWithin(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint($1, $2)::geography,
        $3
      )
      ${filterSql}
      ORDER BY "distanceKm" ASC, available_slots DESC
      `,
      params,
    );
    return rows;
  },
};
