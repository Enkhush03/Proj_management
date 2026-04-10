# SmartPark Fullstack

React + Vite frontend, Express backend, PostgreSQL persistence, ойролцоох зогсоолын газрын зурагтай demo систем.

## Шинэчилсэн боломжууд
- PostgreSQL холболт
- Radius, үнэ, сул зогсоолын filter
- Map дээр nearby parking marker, radius circle, route preview
- Transaction-safe booking/payment flow
- Scrypt password hashing
- Optional PostGIS query mode
- Root package.json-оос frontend/backend хоёуланг зэрэг асаах script

## Structure
```
smartpark-fullstack/
  package.json
  frontend/
  backend/
```

## Root дээрээс ажиллуулах
```bash
npm install
npm run install-all
npm run dev
```

## Backend
```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

### `.env`
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartpark
PGSSL=false
USE_POSTGIS=false
FALLBACK_LAT=47.918873
FALLBACK_LNG=106.917583
```

## Database init
Энгийн PostgreSQL:
```bash
psql postgresql://postgres:postgres@localhost:5432/smartpark -f src/db/schema.sql
psql postgresql://postgres:postgres@localhost:5432/smartpark -f src/db/seed.sql
```

PostGIS ашиглах бол:
```bash
psql postgresql://postgres:postgres@localhost:5432/smartpark -f src/db/schema.postgis.sql
psql postgresql://postgres:postgres@localhost:5432/smartpark -f src/db/seed.sql
```
Дараа нь `.env` дээр `USE_POSTGIS=true` болгоно.

## Frontend
```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Demo user
- identity: `bold@mail.mn`
- password: `Password123!`

## Гол endpoint
- `GET /api/parks/nearby?lat=47.91&lng=106.91&radiusKm=5`
- `GET /api/parks/nearby?lat=47.91&lng=106.91&radiusKm=5&maxHourlyRate=4000&minAvailableSlots=10`
- `POST /api/auth/login`
- `POST /api/bookings`
- `POST /api/payments/:bookingId`

## Тайлбар
- Map route line нь straight preview бөгөөд external directions API ашиглаагүй.
- `Password123!` seed user нь scrypt hash байдлаар хадгалагдана.
- Хэрэв хуучин plain text password бүхий user байвал эхний successful login дээр hash руу migration хийнэ.
