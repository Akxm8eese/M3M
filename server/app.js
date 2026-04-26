import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import waterRoutes from "./routes/waterRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ message: "AgentFlow API is running." });
});

app.use("/api/workouts", workoutRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/reminders", reminderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
