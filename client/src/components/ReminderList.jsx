import { useState, useEffect, useRef } from 'react';
import { reminderApi } from '../services/api';
import ErrorMessage from './ErrorMessage';

/**
 * Browser-based reminder checker.
 * Polls every 30 seconds and shows a browser Notification
 * (with user permission) for any overdue incomplete reminders.
 */
function useReminderNotifier(reminders) {
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    if (!reminders || !('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const check = () => {
      const now = new Date();
      reminders.forEach((r) => {
        if (r.completed) return;
        if (notifiedRef.current.has(r.id)) return;
        if (new Date(r.reminder_time) <= now) {
          notifiedRef.current.add(r.id);
          if (Notification.permission === 'granted') {
            new Notification('AgentFlow Reminder', { body: r.title });
          }
        }
      });
    };

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [reminders]);
}

export default function ReminderList({ reminders, onRefresh, compact }) {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useReminderNotifier(reminders);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Reminder title is required.');
      return;
    }
    if (!dateTime) {
      setError('Please pick a date and time.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await reminderApi.create({ title: title.trim(), reminder_time: dateTime });
      setTitle('');
      setDateTime('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (r) => {
    try {
      await reminderApi.update(r.id, { completed: !r.completed });
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reminderApi.remove(id);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const upcoming = (reminders || []).filter((r) => !r.completed);
  const displayList = compact ? upcoming.slice(0, 4) : reminders || [];

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card">
      <div className="card-title">
        🔔 Reminders {compact && `(${upcoming.length} upcoming)`}
      </div>

      <ErrorMessage message={error} />

      {!compact && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              placeholder="e.g. Follow up with client"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input
              className="form-control"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Reminder'}
          </button>
        </form>
      )}

      {displayList.length === 0 ? (
        <p className="empty">No reminders. {compact ? '' : 'Create one above!'}</p>
      ) : (
        <div className={compact ? '' : 'scrollable-list'}>
          {displayList.map((r) => (
            <div className={`reminder-item ${r.completed ? 'completed' : ''}`} key={r.id}>
              <input
                type="checkbox"
                className="todo-checkbox"
                checked={r.completed}
                onChange={() => toggleComplete(r)}
                aria-label={`Mark "${r.title}" as ${r.completed ? 'incomplete' : 'complete'}`}
              />
              <div style={{ flex: 1 }}>
                <div className="reminder-title">{r.title}</div>
                <div className="reminder-time">{formatTime(r.reminder_time)}</div>
              </div>
              {!compact && (
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(r.id)}
                  title="Delete reminder"
                >
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
