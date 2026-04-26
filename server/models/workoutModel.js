import pool from "../db/pool.js";

export async function getWorkouts() {
  const query = `
    SELECT id, type, duration, notes, created_at
    FROM workouts
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

export async function createWorkout({ type, duration, notes }) {
  const query = `
    INSERT INTO workouts (type, duration, notes)
    VALUES ($1, $2, $3)
    RETURNING id, type, duration, notes, created_at
  `;
  const values = [type, duration, notes || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function deleteWorkoutById(id) {
  const query = `
    DELETE FROM workouts
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}
