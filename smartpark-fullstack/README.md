# SmartPark Fullstack

React frontend + Express backend бүтэцтэй demo/fullstack starter.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Auth: demo token based auth
- Data: in-memory seed data

## Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Backend: `http://localhost:4000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

## Demo users
- Email: `bold@mail.mn`
- Password: `Password123!`

## Architecture
- `frontend/src/api` — API layer
- `frontend/src/context` — auth state
- `frontend/src/pages` — screens
- `backend/src/controllers` — request handler
- `backend/src/services` — business logic
- `backend/src/middleware` — auth / validation / error handling
- `backend/src/data` — seed data

## Notes
- Энэ хувилбар нь demo байдлаар in-memory data ашиглаж байгаа.
- Дараагийн шатанд PostgreSQL/MongoDB холбоход маш амархаар service layer тусгаарласан.
