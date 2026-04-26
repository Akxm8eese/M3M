import { Router } from "express";
import {
  addWorkout,
  listWorkouts,
  removeWorkout,
} from "../controllers/workoutController.js";

const router = Router();

router.get("/", listWorkouts);
router.post("/", addWorkout);
router.delete("/:id", removeWorkout);

export default router;
