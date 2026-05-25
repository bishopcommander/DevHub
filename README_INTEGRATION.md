# DevHub Frontend API Integration

## Base URL
The frontend uses Vite proxy and calls backend through `/api`.

- Frontend dev server: `http://localhost:5173`
- Backend base: `http://localhost:8080/api`

## Connected Endpoints
- `GET /api/v1/health`
- `GET /api/v1/landing`
- `GET /api/v1/dashboard`

## Run
1. Start backend:
   `cd backend && mvn spring-boot:run`
2. Start frontend:
   `cd frontend && npm run dev`
