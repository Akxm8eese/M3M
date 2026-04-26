const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const workoutRoutes = require('./routes/workoutRoutes');
const waterRoutes = require('./routes/waterRoutes');
const todoRoutes = require('./routes/todoRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

const app = express();

// --------------- Middleware ---------------
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// --------------- Health check ---------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- API Routes ---------------
app.use('/api/workouts', workoutRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/reminders', reminderRoutes);

// --------------- Error handler (must be last) ---------------
app.use(errorHandler);

module.exports = app;
