CREATE TABLE IF NOT EXISTS parks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  hourly_rate INTEGER NOT NULL CHECK (hourly_rate >= 0),
  daily_rate INTEGER NOT NULL CHECK (daily_rate >= 0),
  available_slots INTEGER NOT NULL CHECK (available_slots >= 0),
  total_slots INTEGER NOT NULL CHECK (total_slots > 0),
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  identity TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'driver',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  park_id TEXT NOT NULL REFERENCES parks(id) ON DELETE RESTRICT,
  park_name TEXT NOT NULL,
  hours INTEGER NOT NULL CHECK (hours > 0),
  vehicle_plate TEXT NOT NULL,
  total INTEGER NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'CREATED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parks_lat_lng ON parks(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
