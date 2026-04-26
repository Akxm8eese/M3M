import { useState } from 'react';
import { workoutApi } from '../services/api';
import ErrorMessage from './ErrorMessage';

export default function WorkoutCard({ workouts, onRefresh, compact }) {
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!type.trim() || !duration) {
      setError('Please enter a workout type and duration.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await workoutApi.create({
        type: type.trim(),
        duration: Number(duration),
        notes: notes.trim(),
      });
      setType('');
      setDuration('');
      setNotes('');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await workoutApi.remove(id);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const todayWorkouts = workouts?.filter((w) => {
    const created = new Date(w.created_at).toDateString();
    return created === new Date().toDateString();
  }) || [];

  const displayList = compact ? todayWorkouts.slice(0, 3) : workouts || [];

  return (
    <div className="card">
      <div className="card-title">🏋️ Workouts {compact && `(Today: ${todayWorkouts.length})`}</div>

      <ErrorMessage message={error} />

      {!compact && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <input
                className="form-control"
                placeholder="e.g. Running"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Duration (min)</label>
              <input
                className="form-control"
                type="number"
                min="1"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <input
              className="form-control"
              placeholder="How did it go?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Workout'}
          </button>
        </form>
      )}

      {displayList.length === 0 ? (
        <p className="empty">No workouts yet. {compact ? '' : 'Log your first one above!'}</p>
      ) : (
        <div className={compact ? '' : 'scrollable-list'}>
          {displayList.map((w) => (
            <div className="workout-item" key={w.id}>
              <div className="workout-info">
                <div className="workout-type">{w.type}</div>
                <div className="workout-detail">
                  {w.duration} min{w.notes ? ` · ${w.notes}` : ''} ·{' '}
                  {new Date(w.created_at).toLocaleDateString()}
                </div>
              </div>
              {!compact && (
                <button className="btn btn-danger" onClick={() => handleDelete(w.id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
