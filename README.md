# AgentFlow

A production-ready, mobile-first productivity dashboard for life insurance agents and busy professionals. Track workouts, water intake, daily tasks, and reminders — all in one clean interface.

---

## Features

| Module | Capabilities |
|---|---|
| **Dashboard** | At-a-glance view of today's workouts, water progress, pending tasks, and upcoming reminders |
| **Workout Tracker** | Log workout type, duration, and notes; view history; delete entries |
| **Water Intake** | Quick-add buttons (8 / 12 / 16 / 24 oz), custom amounts, daily progress bar (64 oz goal), auto-resets daily |
| **Todo Checklist** | Create tasks with priority (low / medium / high) and optional due date; mark complete / incomplete; delete |
| **Reminders** | Set title + date/time; browser notifications for overdue items; mark complete; delete |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL |
| Styling | Custom CSS (mobile-first, navy / white / gold palette) |
| Deployment | Vercel (frontend), Render or Railway (backend + Postgres) |

---

## Project Structure

```
agentflow/
├── client/                 # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # API client helpers
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # Global CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── server/                 # Express API backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # Express routers
│   ├── models/             # Database queries
│   ├── middleware/         # Error handler, etc.
│   ├── db/                 # Pool config & init script
│   ├── app.js              # Express app setup
│   ├── server.js           # Entry point
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Local Setup

### Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** 14+ running locally (or a remote instance)

### 1. Clone the repository

```bash
git clone <repo-url>
cd agentflow
```

### 2. Set up PostgreSQL

Create a database:

```bash
psql -U postgres -c "CREATE DATABASE agentflow;"
```

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=agentflow
PORT=5000
CLIENT_URL=http://localhost:5173
```

Install dependencies and initialize tables:

```bash
npm install
npm run db:init
```

Start the development server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 4. Configure the frontend

In a new terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The app opens at `http://localhost:5173`. Vite proxies `/api` requests to the backend automatically during development.

---

## API Routes

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

### Workouts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workouts` | Get all workouts |
| POST | `/api/workouts` | Create a workout (`type`, `duration`, `notes?`) |
| DELETE | `/api/workouts/:id` | Delete a workout |

### Water Intake

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/water/today` | Get today's water logs + total |
| POST | `/api/water` | Add water entry (`amount` in oz) |
| DELETE | `/api/water/:id` | Delete a water log |

### Todos

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a todo (`text`, `priority?`, `due_date?`) |
| PUT | `/api/todos/:id` | Update a todo (any field) |
| DELETE | `/api/todos/:id` | Delete a todo |

### Reminders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reminders` | Get all reminders |
| POST | `/api/reminders` | Create a reminder (`title`, `reminder_time`) |
| PUT | `/api/reminders/:id` | Update a reminder (any field) |
| DELETE | `/api/reminders/:id` | Delete a reminder |

---

## Database Schema

### workouts

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| type | VARCHAR(100) | Not null |
| duration | INTEGER | Minutes, not null |
| notes | TEXT | Optional |
| created_at | TIMESTAMPTZ | Auto-set |

### water_logs

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| amount | NUMERIC(6,1) | Ounces, not null |
| created_at | TIMESTAMPTZ | Auto-set |

### todos

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| text | VARCHAR(500) | Not null |
| completed | BOOLEAN | Default false |
| priority | VARCHAR(10) | low / medium / high |
| due_date | DATE | Optional |
| created_at | TIMESTAMPTZ | Auto-set |

### reminders

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(300) | Not null |
| reminder_time | TIMESTAMPTZ | Not null |
| completed | BOOLEAN | Default false |
| created_at | TIMESTAMPTZ | Auto-set |

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_NAME` | Database name | `agentflow` |
| `PORT` | API server port | `5000` |
| `CLIENT_URL` | Frontend origin (CORS) | `http://localhost:5173` |

### Frontend (`client/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL (production only) | _(empty — uses Vite proxy in dev)_ |

---

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `client`.
4. Framework preset: **Vite**.
5. Add the environment variable:
   - `VITE_API_URL` = your deployed backend URL (e.g. `https://agentflow-api.onrender.com`)
6. Deploy.

For client-side routing, add a `client/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend → Render / Railway

#### Render

1. Create a new **Web Service** connected to the repo.
2. Set **Root Directory** to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all env vars from `server/.env.example`.
6. Attach a managed PostgreSQL database (Render provides free-tier Postgres).
7. Run `npm run db:init` via the Render shell to create tables.

#### Railway

1. Create a new project and connect the repo.
2. Add a PostgreSQL plugin.
3. Set the root directory to `server` and add env vars.
4. Railway auto-detects Node.js and runs `npm start`.

---

## Future Upgrades

- **Authentication** — Add user accounts with JWT or OAuth so each agent has private data.
- **Progressive Web App (PWA)** — Add a service worker and manifest for install-to-home-screen and offline caching.
- **Push notifications** — Integrate Web Push API for background reminder alerts.
- **Data export** — Export workout history and water logs as CSV/PDF reports.
- **Recurring reminders** — Support daily / weekly repeat schedules.
- **Dark mode** — Toggle between light and dark themes.
- **Charts & analytics** — Visualize workout trends and water consistency over time.
- **Team dashboards** — Agency managers can view team activity.

---

## License

MIT
