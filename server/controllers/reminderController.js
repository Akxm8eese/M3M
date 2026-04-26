const ReminderModel = require('../models/reminderModel');

exports.getReminders = async (req, res, next) => {
  try {
    const reminders = await ReminderModel.getAll();
    res.json(reminders);
  } catch (err) {
    next(err);
  }
};

exports.createReminder = async (req, res, next) => {
  try {
    const { title, reminder_time } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Reminder title is required.' });
    }
    if (!reminder_time) {
      return res.status(400).json({ error: 'Reminder date/time is required.' });
    }

    const parsed = new Date(reminder_time);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({ error: 'Invalid date/time format.' });
    }

    const reminder = await ReminderModel.create({
      title: title.trim(),
      reminder_time: parsed,
    });
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};

exports.updateReminder = async (req, res, next) => {
  try {
    const updated = await ReminderModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Reminder not found.' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    const deleted = await ReminderModel.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Reminder not found.' });
    }
    res.json({ message: 'Reminder deleted.' });
  } catch (err) {
    next(err);
  }
};
