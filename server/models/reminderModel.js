import pool from "../db/pool.js";

export async function getReminders() {
  const query = `
    SELECT id, title, reminder_time, completed, created_at
    FROM reminders
    ORDER BY completed ASC, reminder_time ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

export async function createReminder({ title, reminderTime }) {
  const query = `
    INSERT INTO reminders (title, reminder_time)
    VALUES ($1, $2)
    RETURNING id, title, reminder_time, completed, created_at
  `;
  const { rows } = await pool.query(query, [title, reminderTime]);
  return rows[0];
}

export async function updateReminderById(id, updates) {
  const fields = [];
  const values = [];
  let index = 1;

  if (typeof updates.title === "string") {
    fields.push(`title = $${index++}`);
    values.push(updates.title);
  }
  if (typeof updates.reminderTime === "string") {
    fields.push(`reminder_time = $${index++}`);
    values.push(updates.reminderTime);
  }
  if (typeof updates.completed === "boolean") {
    fields.push(`completed = $${index++}`);
    values.push(updates.completed);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);
  const query = `
    UPDATE reminders
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, title, reminder_time, completed, created_at
  `;
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

export async function deleteReminderById(id) {
  const query = `
    DELETE FROM reminders
    WHERE id = $1
    RETURNING id, title, reminder_time, completed, created_at
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}
