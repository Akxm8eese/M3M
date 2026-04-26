import {
  createTodo,
  deleteTodoById,
  getTodos,
  updateTodoById,
} from "../models/todoModel.js";

function normalizePriority(priority) {
  if (priority == null) {
    return null;
  }
  const value = String(priority).toLowerCase().trim();
  const allowed = ["low", "medium", "high"];
  if (!allowed.includes(value)) {
    return null;
  }
  return value;
}

function normalizeDueDate(dateValue) {
  if (dateValue === undefined) {
    return undefined;
  }
  if (dateValue === null || dateValue === "") {
    return null;
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return dateValue;
}

export async function listTodos(_req, res, next) {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function addTodo(req, res, next) {
  try {
    const { text, priority, due_date: dueDate } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Task text is required." });
    }

    const normalizedPriority = normalizePriority(priority);
    if (!normalizedPriority) {
      return res
        .status(400)
        .json({ error: "Priority must be one of: low, medium, high." });
    }

    const normalizedDueDate = normalizeDueDate(dueDate);
    if (normalizedDueDate === undefined) {
      return res.status(400).json({ error: "Due date must be a valid date." });
    }

    const todo = await createTodo({
      text: String(text).trim(),
      priority: normalizedPriority,
      dueDate: normalizedDueDate,
    });
    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid todo id." });
    }

    const payload = {};
    const { text, completed, priority, due_date: dueDate } = req.body;

    if (text !== undefined) {
      if (!String(text).trim()) {
        return res.status(400).json({ error: "Task text cannot be empty." });
      }
      payload.text = String(text).trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res
          .status(400)
          .json({ error: "Completed must be a boolean value." });
      }
      payload.completed = completed;
    }

    if (priority !== undefined) {
      const normalizedPriority = normalizePriority(priority);
      if (!normalizedPriority) {
        return res
          .status(400)
          .json({ error: "Priority must be one of: low, medium, high." });
      }
      payload.priority = normalizedPriority;
    }

    if (dueDate !== undefined) {
      const normalizedDueDate = normalizeDueDate(dueDate);
      if (normalizedDueDate === undefined) {
        return res.status(400).json({ error: "Due date must be a valid date." });
      }
      payload.dueDate = normalizedDueDate;
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "No update fields were provided." });
    }

    const todo = await updateTodoById(id, payload);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    return res.json(todo);
  } catch (error) {
    next(error);
  }
}

export async function removeTodo(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid todo id." });
    }

    const deleted = await deleteTodoById(id);
    if (!deleted) {
      return res.status(404).json({ error: "Todo not found." });
    }

    return res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    next(error);
  }
}
