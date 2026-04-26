import {
  createWorkout,
  deleteWorkoutById,
  getWorkouts,
} from "../models/workoutModel.js";

export async function listWorkouts(_req, res, next) {
  try {
    const workouts = await getWorkouts();
    res.json(workouts);
  } catch (error) {
    next(error);
  }
}

export async function addWorkout(req, res, next) {
  try {
    const { type, duration, notes } = req.body;

    if (typeof type !== "string" || type.trim().length === 0) {
      return res.status(400).json({ error: "Workout type is required." });
    }

    const parsedDuration = Number(duration);
    if (!Number.isInteger(parsedDuration) || parsedDuration <= 0) {
      return res
        .status(400)
        .json({ error: "Duration must be a positive integer." });
    }

    const workout = await createWorkout({
      type: type.trim(),
      duration: parsedDuration,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    });

    return res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
}

export async function removeWorkout(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid workout id." });
    }

    const deleted = await deleteWorkoutById(id);
    if (!deleted) {
      return res.status(404).json({ error: "Workout not found." });
    }

    return res.json({ message: "Workout deleted successfully." });
  } catch (error) {
    next(error);
  }
}
