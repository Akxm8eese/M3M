import {
  createReminder,
  deleteReminderById,
  getReminders,
  updateReminderById,
} from "../models/reminderModel.js";

export async function listReminders(_req, res, next) {
  try {
    const reminders = await getReminders();
    res.json(reminders);
  } catch (error) {
    next(error);
  }
}

export async function addReminder(req, res, next) {
  try {
    const { title, reminder_time: reminderTime } = req.body;
    const reminder = await createReminder({ title, reminderTime });
    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
}

export async function updateReminder(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid reminder id." });
    }

    const payload = {};
    if (typeof req.body.title !== "undefined") payload.title = req.body.title;
    if (typeof req.body.reminder_time !== "undefined") {
      payload.reminderTime = req.body.reminder_time;
    }
    if (typeof req.body.completed !== "undefined") {
      payload.completed = req.body.completed;
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    const reminder = await updateReminderById(id, payload);
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found." });
    }

    return res.json(reminder);
  } catch (error) {
    next(error);
  }
}

export async function removeReminder(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid reminder id." });
    }

    const deleted = await deleteReminderById(id);
    if (!deleted) {
      return res.status(404).json({ error: "Reminder not found." });
    }

    return res.json({ message: "Reminder deleted successfully." });
  } catch (error) {
    next(error);
  }
}
