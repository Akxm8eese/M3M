const PRIORITIES = ["low", "medium", "high"];

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidDate(value) {
  return !Number.isNaN(Date.parse(value));
}

export function validateWaterPayload(req, res, next) {
  const { amount } = req.body ?? {};
  if (!isPositiveInteger(amount)) {
    return res
      .status(400)
      .json({ error: "Amount is required and must be a positive integer." });
  }
  return next();
}

export function validateTodoPayload(req, res, next) {
  const { text, priority, due_date: dueDate } = req.body ?? {};

  if (typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Task text is required." });
  }

  if (!PRIORITIES.includes(String(priority).toLowerCase())) {
    return res
      .status(400)
      .json({ error: "Priority must be one of: low, medium, high." });
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== "" && !isValidDate(dueDate)) {
    return res.status(400).json({ error: "Due date must be a valid date." });
  }

  return next();
}

export function validateTodoUpdatePayload(req, res, next) {
  const { text, completed, priority, due_date: dueDate } = req.body ?? {};

  if (
    text !== undefined &&
    (typeof text !== "string" || String(text).trim().length === 0)
  ) {
    return res.status(400).json({ error: "Task text cannot be empty." });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean value." });
  }

  if (
    priority !== undefined &&
    !PRIORITIES.includes(String(priority).toLowerCase().trim())
  ) {
    return res
      .status(400)
      .json({ error: "Priority must be one of: low, medium, high." });
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== "" && !isValidDate(dueDate)) {
    return res.status(400).json({ error: "Due date must be a valid date." });
  }

  return next();
}

export function validateReminderPayload(req, res, next) {
  const { title, reminder_time: reminderTime } = req.body ?? {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Reminder title is required." });
  }

  if (!reminderTime || !isValidDate(reminderTime)) {
    return res
      .status(400)
      .json({ error: "Reminder time is required and must be a valid date/time." });
  }

  return next();
}

export function validateReminderUpdatePayload(req, res, next) {
  const { title, reminder_time: reminderTime, completed } = req.body ?? {};

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    return res.status(400).json({ error: "Reminder title cannot be empty." });
  }

  if (reminderTime !== undefined && reminderTime !== null && !isValidDate(reminderTime)) {
    return res.status(400).json({ error: "Reminder time must be a valid date/time." });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean value." });
  }

  return next();
}

export function validatePositiveId(req, res, next) {
  const id = Number(req.params.id);
  if (!isPositiveInteger(id)) {
    return res.status(400).json({ error: "ID must be a positive integer." });
  }
  return next();
}
