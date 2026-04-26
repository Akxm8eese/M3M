/**
 * Database initialization script.
 * Run with: npm run db:init
 * Creates all required tables if they don't already exist.
 */

require('dotenv').config();
const pool = require('./pool');

const schema = `
  CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS water_logs (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(6,1) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium'
      CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    reminder_time TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`;

async function init() {
  try {
    await pool.query(schema);
    console.log('Database tables created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  }
}

init();
