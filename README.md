# FinGuard AI

FinGuard AI is a full-stack personal finance tracker built with React, Node.js, Express, and MongoDB.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios, Chart.js
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt

## Project Structure

```text
FinGuard/
  client/
  server/
```

## Backend Setup (`server`)

1. Copy environment template (`.env.example`) to `.env`.

2. Update `.env` values:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional)

MongoDB Atlas notes:
- Use the `mongodb+srv://...` URI from Atlas "Connect".
- In Atlas, go to Network Access and allow your current public IP (or `0.0.0.0/0` for local development only).
- Ensure the Atlas database user in `MONGO_URI` has the correct password and database permissions.

3. Install dependencies and run backend:

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

## Frontend Setup (`client`)

1. Copy environment template (`.env.example`) to `.env`.

2. Install dependencies and run frontend:

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/transactions` (protected)
- `POST /api/transactions` (protected)
- `PUT /api/transactions/:id` (protected)
- `DELETE /api/transactions/:id` (protected)

## Features Implemented

- User registration and login with JWT auth
- Protected routes on frontend and backend
- Add, list, and delete transactions
- Dashboard with total income, total expense, balance
- Monthly spending and category-wise analytics charts
- Responsive UI with sidebar navigation
