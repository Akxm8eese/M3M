const TodoModel = require('../models/todoModel');

exports.getTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.getAll();
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const { text, priority, due_date } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Task text is required.' });
    }
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be low, medium, or high.' });
    }

    const todo = await TodoModel.create({ text: text.trim(), priority, due_date });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const updated = await TodoModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const deleted = await TodoModel.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json({ message: 'Todo deleted.' });
  } catch (err) {
    next(err);
  }
};
