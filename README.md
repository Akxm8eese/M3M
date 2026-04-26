# AgentFlow

AgentFlow is a production-ready, mobile-first productivity application for life insurance agents and busy professionals.  
It combines health habits and execution habits in one simple dashboard:

- Workouts
- Daily water intake
- Todo checklist
- Reminders (browser local notification logic)

---

## App Overview

AgentFlow helps non-technical professionals stay consistent each day by tracking:

1. **Fitness actions** (workouts and duration)
2. **Hydration goals** (default 64 oz/day)
3. **Execution tasks** (priority-based todos)
4. **Time-based follow-ups** (reminders)

The UI is designed with a navy/white/gold palette and large controls for easy use on iPhone and desktop browsers.

---

## Features

### Dashboard
- Snapshot cards for:
  - Today’s workouts
  - Water progress
  - Pending tasks
  - Upcoming reminders
- Refresh button to reload all modules quickly

### Workout Tracker
- Add workout type
- Add duration (minutes)
- Add optional notes
- View workout history
- Delete workout entries

### Water Intake Tracker
- Default daily goal: **64 oz**
- Quick add buttons (+8 oz, +16 oz)
- Custom amount input
- Daily total and progress bar
- Day-based reset behavior from backend query (`CURRENT_DATE`)
- Delete individual logs

### Todo Checklist
- Create tasks
- Set priority (`low`, `medium`, `high`)
- Set optional due date
- Mark complete/incomplete
- Delete tasks

### Reminder System
- Create reminder title
- Set date/time
- Mark complete/reopen
- Delete reminder
- Browser notification support (no paid APIs)

---

## Tech Stack

### Frontend
- React + Vite
- Vanilla CSS (mobile-first responsive)
- Fetch API for backend communication

### Backend
- Node.js + Express
- MVC folder structure
- PostgreSQL (`pg` package)

### Database
- PostgreSQL tables:
  - `workouts`
  - `water_logs`
  - `todos`
  - `reminders`

---

## Project Structure

```text
.
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ styles/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ .env.example
│  ├─ package.json
│  └─ vite.config.js
├─ server/
│  ├─ controllers/
│  ├─ db/
│  │  ├─ pool.js
│  │  └─ schema.sql
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ .env.example
│  ├─ app.js
│  ├─ package.json
│  └─ server.js
└─ README.md
```

---

## Local Setup

### 1) Clone and install dependencies

```bash
# From repository root
cd server && npm install
cd ../client && npm install
```

### 2) PostgreSQL setup

1. Create a database (example name: `agentflow`).
2. Copy and configure server environment:

```bash
cd server
cp .env.example .env
```

3. Update `DATABASE_URL` in `server/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agentflow
```

4. Run schema:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

### 3) Configure frontend environment

```bash
cd ../client
cp .env.example .env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### 4) Start development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

Frontend default URL: `http://localhost:5173`

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend port (default `5001`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CLIENT_ORIGIN` | No | Allowed CORS origin for frontend |

### Frontend (`client/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Backend API base URL (e.g. `http://localhost:5001/api`) |

---

## API Routes

### Workouts
- `GET /api/workouts`
- `POST /api/workouts`
- `DELETE /api/workouts/:id`

### Water
- `GET /api/water/today`
- `POST /api/water`
- `DELETE /api/water/:id`

### Todos
- `GET /api/todos`
- `POST /api/todos`
- `PUT /api/todos/:id`
- `DELETE /api/todos/:id`

### Reminders
- `GET /api/reminders`
- `POST /api/reminders`
- `PUT /api/reminders/:id`
- `DELETE /api/reminders/:id`

---

## PostgreSQL Schema

Defined in `server/db/schema.sql`:

- `workouts(id, type, duration, notes, created_at)`
- `water_logs(id, amount, created_at)`
- `todos(id, text, completed, priority, due_date, created_at)`
- `reminders(id, title, reminder_time, completed, created_at)`

Each table includes validation constraints (e.g., positive amounts, allowed priority values).

---

## Error Handling

### Backend
- Consistent JSON error responses
- Input validation middleware and controller-level checks
- Global Express error handler
- Clear status codes for validation errors (`400`), missing records (`404`), and server failures (`500`)

### Frontend
- Friendly error messages shown in UI
- Form validation for required fields
- Prevents empty/invalid submissions
- Handles API errors from backend gracefully

---

## Deployment Notes

### Frontend (Vercel)

1. Import the `client` folder as a Vercel project.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable:
   - `VITE_API_BASE_URL=https://<your-backend-domain>/api`

### Backend (Render or Railway)

1. Deploy from the `server` folder.
2. Start command: `npm start`
3. Set environment variables:
   - `DATABASE_URL`
   - `PORT` (if platform requires)
   - `CLIENT_ORIGIN` (frontend domain)
4. Ensure PostgreSQL instance is provisioned and schema is applied (`db/schema.sql`).

---

## Future Upgrades

- User authentication and multi-user data isolation
- Recurring reminders
- Push notifications (service worker)
- Dashboard analytics (weekly completion trends)
- CSV export/reporting for coaching/accountability
- Unit/integration test suites (Jest + React Testing Library + Supertest)

---

## License

Private/internal project for AgentFlow MVP.
