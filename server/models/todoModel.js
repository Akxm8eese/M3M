const pool = require('../db/pool');

const TodoModel = {
  async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    return rows;
  },

  async create({ text, priority, due_date }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (text, priority, due_date)
       VALUES ($1, $2, $3) RETURNING *`,
      [text, priority || 'medium', due_date || null]
    );
    return rows[0];
  },

  async update(id, fields) {
    const allowed = ['text', 'completed', 'priority', 'due_date'];
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
      `UPDATE todos SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async deleteById(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM todos WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = TodoModel;
