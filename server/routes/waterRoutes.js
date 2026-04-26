import { Router } from "express";
import {
  addWater,
  deleteWaterLog,
  getTodayWater,
} from "../controllers/waterController.js";
import { validatePositiveId, validateWaterPayload } from "../middleware/validate.js";

const router = Router();

router.get("/today", getTodayWater);
router.post("/", validateWaterPayload, addWater);
router.delete("/:id", validatePositiveId, deleteWaterLog);

export default router;
