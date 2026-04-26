import pool from "../db/pool.js";

export const getTodayTotal = async () => {
  const query = `
    SELECT COALESCE(SUM(amount), 0)::INT AS total
    FROM water_logs
    WHERE created_at::date = CURRENT_DATE
  `;
  const { rows } = await pool.query(query);
  return rows[0].total;
};

export const getTodayLogs = async () => {
  const query = `
    SELECT id, amount, created_at
    FROM water_logs
    WHERE created_at::date = CURRENT_DATE
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

export const createWaterLog = async ({ amount }) => {
  const query = `
    INSERT INTO water_logs (amount)
    VALUES ($1)
    RETURNING id, amount, created_at
  `;
  const values = [amount];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteWaterLogById = async (id) => {
  const query = `
    DELETE FROM water_logs
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};
