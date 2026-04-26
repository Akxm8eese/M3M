const WorkoutModel = require('../models/workoutModel');

exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await WorkoutModel.getAll();
    res.json(workouts);
  } catch (err) {
    next(err);
  }
};

exports.createWorkout = async (req, res, next) => {
  try {
    const { type, duration, notes } = req.body;

    if (!type || !duration) {
      return res.status(400).json({ error: 'Workout type and duration are required.' });
    }
    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ error: 'Duration must be a positive number (minutes).' });
    }

    const workout = await WorkoutModel.create({ type, duration, notes });
    res.status(201).json(workout);
  } catch (err) {
    next(err);
  }
};

exports.deleteWorkout = async (req, res, next) => {
  try {
    const deleted = await WorkoutModel.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Workout not found.' });
    }
    res.json({ message: 'Workout deleted.' });
  } catch (err) {
    next(err);
  }
};
