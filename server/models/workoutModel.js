const pool = require('../db/pool');

const WorkoutModel = {
  async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM workouts ORDER BY created_at DESC'
    );
    return rows;
  },

  async create({ type, duration, notes }) {
    const { rows } = await pool.query(
      'INSERT INTO workouts (type, duration, notes) VALUES ($1, $2, $3) RETURNING *',
      [type, duration, notes || '']
    );
    return rows[0];
  },

  async deleteById(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM workouts WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = WorkoutModel;
