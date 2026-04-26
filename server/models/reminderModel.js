const pool = require('../db/pool');

const ReminderModel = {
  async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM reminders ORDER BY reminder_time ASC'
    );
    return rows;
  },

  async create({ title, reminder_time }) {
    const { rows } = await pool.query(
      `INSERT INTO reminders (title, reminder_time)
       VALUES ($1, $2) RETURNING *`,
      [title, reminder_time]
    );
    return rows[0];
  },

  async update(id, fields) {
    const allowed = ['title', 'reminder_time', 'completed'];
    const sets = [];
    const values = [];
    let idx = 1;

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = $${idx++}`);
        values.push(fields[key]);
      }
    }

    if (sets.length === 0) return null;

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE reminders SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM reminders WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = ReminderModel;
