import pool from "../db/pool.js";

export const getTodos = async () => {
  const result = await pool.query(
    `
      SELECT id, text, completed, priority, due_date, created_at
      FROM todos
      ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC
    `
  );
  return result.rows;
};

export const createTodo = async ({ text, priority, dueDate }) => {
  const result = await pool.query(
    `
      INSERT INTO todos (text, priority, due_date)
      VALUES ($1, $2, $3)
      RETURNING id, text, completed, priority, due_date, created_at
    `,
    [text, priority, dueDate ?? null]
  );
  return result.rows[0];
};

export const updateTodoById = async (id, { text, completed, priority, dueDate }) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (typeof text === "string") {
    fields.push(`text = $${index++}`);
    values.push(text);
  }
  if (typeof completed === "boolean") {
    fields.push(`completed = $${index++}`);
    values.push(completed);
  }
  if (typeof priority === "string") {
    fields.push(`priority = $${index++}`);
    values.push(priority);
  }
  if (dueDate !== undefined) {
    fields.push(`due_date = $${index++}`);
    values.push(dueDate || null);
  }

  if (fields.length === 0) {
    const existing = await pool.query(
      `
        SELECT id, text, completed, priority, due_date, created_at
        FROM todos
        WHERE id = $1
      `,
      [id]
    );
    return existing.rows[0] || null;
  }

  values.push(id);
  const query = `
    UPDATE todos
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, text, completed, priority, due_date, created_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const deleteTodoById = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM todos
      WHERE id = $1
      RETURNING id, text, completed, priority, due_date, created_at
    `,
    [id]
  );
  return result.rows[0] || null;
};

export const updateTodo = updateTodoById;
export const deleteTodo = deleteTodoById;
