import { useState } from "react";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function WorkoutCard({ workouts, onAddWorkout, onDeleteWorkout }) {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedType = type.trim();
    const parsedDuration = Number(duration);

    if (!trimmedType) {
      setError("Please add a workout type.");
      return;
    }

    if (!Number.isInteger(parsedDuration) || parsedDuration <= 0) {
      setError("Duration must be a positive number of minutes.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddWorkout({
        type: trimmedType,
        duration: parsedDuration,
        notes: notes.trim() || null,
      });
      setType("");
      setDuration("");
      setNotes("");
    } catch (submitError) {
      setError(submitError.message || "Unable to save workout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Workout Tracker</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          Workout Type
          <input
            type="text"
            value={type}
            onChange={(event) => setType(event.target.value)}
            placeholder="Example: Cardio"
            maxLength={100}
          />
        </label>
        <label className="field">
          Duration (minutes)
          <input
            type="number"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="30"
            min="1"
          />
        </label>
        <label className="field">
          Notes (optional)
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="How did it feel?"
            rows={3}
          />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Workout"}
        </button>
      </form>

      <div className="list-section">
        <h3>Workout History</h3>
        {workouts.length === 0 ? (
          <p className="empty">No workouts logged yet.</p>
        ) : (
          <ul className="item-list">
            {workouts.map((workout) => (
              <li key={workout.id} className="item">
                <div>
                  <p className="item-title">{workout.type}</p>
                  <p className="item-subtitle">
                    {workout.duration} min • {formatDate(workout.created_at)}
                  </p>
                  {workout.notes ? <p className="item-note">{workout.notes}</p> : null}
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onDeleteWorkout(workout.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
