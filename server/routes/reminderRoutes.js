import { Router } from "express";
import {
  addReminder,
  listReminders,
  removeReminder,
  updateReminder,
} from "../controllers/reminderController.js";
import { validateReminderPayload, validateReminderUpdatePayload } from "../middleware/validate.js";

const router = Router();

router.get("/", listReminders);
router.post("/", validateReminderPayload, addReminder);
router.put("/:id", validateReminderUpdatePayload, updateReminder);
router.delete("/:id", removeReminder);

export default router;
