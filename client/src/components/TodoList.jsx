import { useState } from 'react';
import { todoApi } from '../services/api';
import ErrorMessage from './ErrorMessage';

export default function TodoList({ todos, onRefresh, compact }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Task text is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await todoApi.create({
        text: text.trim(),
        priority,
        due_date: dueDate || null,
      });
      setText('');
      setPriority('medium');
      setDueDate('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await todoApi.update(todo.id, { completed: !todo.completed });
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoApi.remove(id);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const pending = (todos || []).filter((t) => !t.completed);
  const displayList = compact ? pending.slice(0, 4) : todos || [];

  return (
    <div className="card">
      <div className="card-title">
        ✅ Tasks {compact && `(${pending.length} pending)`}
      </div>

      <ErrorMessage message={error} />

      {!compact && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label>Task</label>
            <input
              className="form-control"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                className="form-control"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      )}

      {displayList.length === 0 ? (
        <p className="empty">No tasks yet. {compact ? '' : 'Add one above!'}</p>
      ) : (
        <div className={compact ? '' : 'scrollable-list'}>
          {displayList.map((t) => (
            <div className={`todo-item ${t.completed ? 'completed' : ''}`} key={t.id}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t)}
                aria-label={`Mark "${t.text}" as ${t.completed ? 'incomplete' : 'complete'}`}
              />
              <div style={{ flex: 1 }}>
                <div className="todo-text">{t.text}</div>
                <div className="todo-meta">
                  <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                  {t.due_date && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      Due: {new Date(t.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {!compact && (
                <button className="btn-icon" onClick={() => handleDelete(t.id)} title="Delete task">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
