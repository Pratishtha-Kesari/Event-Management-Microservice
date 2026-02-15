# Event Management Frontend

Clean, minimal frontend for the Event Management microservice backend.

## Setup

```bash
cd frontend
npm install
```

## Run

Start the backend (API Gateway on port 8080) first. Then:

```bash
npm run dev
```

The app runs at http://localhost:5173 and proxies API requests to the gateway.

## Features

- **Auth**: Login, Register (USER/ADMIN roles)
- **Events**: Browse events, view details, register (User only)
- **Registrations**: My registrations, cancel pending
- **Admin**: Create events, view users (Admin only)

## API Base

Uses `/api` proxy to `http://localhost:8080` in development. For production, configure your API gateway URL via environment or Vite proxy.
