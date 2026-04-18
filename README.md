# Adaptive Multi-Algorithm Authentication System

A highly secure, state-of-the-art authentication system demonstrating dynamic hashing, hybrid temporal salting, and latency tracking. Built with React (Vite + Tailwind) and Node.js (Express + SQLite).

## Features

- **Hybrid Salting Strategy:** Uses a 16-byte random CSPRNG salt combined with an HMAC-SHA256 timestamp-derived temporal salt for maximum rainbow table resistance.
- **Dynamic Hashing Engine:** Automatically shifts between `argon2id`, `scrypt`, `bcrypt`, `PBKDF2`, and `SHA-256` based on password strength evaluations and configured server loads.
- **Constant-Time Comparison:** Security-first verification to entirely mitigate timing attacks.
- **Live Metrics Engine:** Native backend metrics layer intercepting computation duration, tracking `hashTime`, `verifyTime`, and usage charts gracefully visualized on the frontend via Recharts.

## Tech Stack

- **Backend:** Node.js, Express, SQLite3, Native Crypto Module, bcrypt, argon2.
- **Frontend:** React (Vite), React Router v7, Tailwind CSS v4 (Glassmorphism), Recharts, Lucide Icons.

## Project Structure

```
adaptive-auth-system/
├── backend/                  # Node.js Express server
│   ├── index.ts              # API routes and server
│   ├── database.ts           # SQLite Database config
│   ├── hashing.ts            # Hashing & Salt logic
│   ├── simulation.ts         # Load testing script
│   └── package.json          
└── frontend/                 # React Vite project
    ├── src/
    │   ├── App.tsx           # Router and Navbar
    │   ├── index.css         # Tailwind directives
    │   ├── pages/            # View components (Home, Login, Register, Dashboard, Metrics)
    └── package.json
```

## Setup & Running

### 1. Start Backend

Open a terminal window and navigate to the backend directory:

```bash
cd backend
npm install
npm run start
```
*The backend server boots on `http://localhost:3001`.*

### 2. Run Synthetic Load Generation (Optional)

In another terminal, populate the database with synthetic login traffic and performance metrics:
```bash
cd backend
npm run sim
```

### 3. Start Frontend

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to interact with the platform.

## Design Philosophy
For this project, we explicitly avoid traditional singular-algorithm choices (like picking only bcrypt), leaning into a "resiliency through variability" architecture paired with a dark-mode neon interactive dashboard.
# AuthX
