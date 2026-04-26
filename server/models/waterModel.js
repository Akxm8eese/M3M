const pool = require('../db/pool');

const WaterModel = {
  /** Fetch all water logs for the current calendar day (server timezone). */
  async getToday() {
    const { rows } = await pool.query(
      `SELECT * FROM water_logs
       WHERE created_at::date = CURRENT_DATE
       ORDER BY created_at DESC`
    );
    return rows;
  },

  async create({ amount }) {
    const { rows } = await pool.query(
      'INSERT INTO water_logs (amount) VALUES ($1) RETURNING *',
      [amount]
    );
    return rows[0];
  },

  async deleteById(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM water_logs WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = WaterModel;
