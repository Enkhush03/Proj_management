INSERT INTO parks (id, name, address, latitude, longitude, hourly_rate, daily_rate, available_slots, total_slots, features)
VALUES
  ('park1', 'Их наяд Төв', 'Сүхбаатар дүүрэг, 1-р хороо', 47.918467, 106.917701, 4000, 30000, 42, 120, ARRAY['CCTV', 'EV Charging', '24/7 Security']),
  ('park2', 'Монолит Граж', 'Чингэлтэй дүүрэг, 4-р хороо', 47.922133, 106.911939, 3500, 25000, 12, 80, ARRAY['Indoor', 'Fast Entry', 'Guard']),
  ('park3', 'Central Plaza Station', 'Чингис хааны талбай-2', 47.918873, 106.917583, 5000, 40000, 60, 150, ARRAY['Premium', 'Lift', 'CCTV']),
  ('park4', 'Shangri-La Parking', 'Olympic Street, SBD', 47.913284, 106.930441, 6000, 45000, 34, 140, ARRAY['Mall Access', 'Indoor', 'CCTV']),
  ('park5', 'Peace Bridge Parking', 'Энхтайваны өргөн чөлөө, Баянгол дүүрэг', 47.909055, 106.883410, 3000, 22000, 25, 90, ARRAY['Budget', 'Outdoor', 'Guard'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, identity, password, role)
VALUES ('u1', 'Болд Дорж', 'bold@mail.mn', 'scrypt$16384$8$1$3061cda8a6c19dd562970b095309acb7$68180a07eaa21964a7fd754b8219dc003dc7814b4320425ea9067b758f606c94fba9ad773bb3e071764486eddcaa76a86df73dc36ed95efdf4b4a5130e680da3', 'driver')
ON CONFLICT (identity) DO NOTHING;
