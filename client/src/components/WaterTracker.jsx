import { useState } from "react";

function formatTime(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function WaterTracker({
  water,
  onAddWater,
  onDeleteWaterLog,
  loading,
}) {
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const total = water?.total ?? 0;
  const goal = water?.goal ?? 64;
  const percent = Math.min((total / goal) * 100, 100);

  async function handleQuickAdd(value) {
    try {
      setFormError("");
      await onAddWater(value);
    } catch (error) {
      setFormError(error.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      setFormError("Enter a valid water amount in ounces.");
      return;
    }

    try {
      setFormError("");
      await onAddWater(parsedAmount);
      setAmount("");
    } catch (error) {
      setFormError(error.message);
    }
  }

  return (
    <section className="card water-card">
      <div className="card-header">
        <h2>Water Intake</h2>
        <span className="tag">{total} oz today</span>
      </div>

      <div className="water-progress">
        <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={total}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="muted">
          Goal: {goal} oz ({Math.max(goal - total, 0)} oz remaining)
        </p>
      </div>

      <div className="quick-actions">
        <button type="button" className="btn-secondary" onClick={() => handleQuickAdd(8)} disabled={loading}>
          +8 oz
        </button>
        <button type="button" className="btn-secondary" onClick={() => handleQuickAdd(16)} disabled={loading}>
          +16 oz
        </button>
      </div>

      <form className="stack-sm" onSubmit={handleSubmit}>
        <label>
          Add custom amount (oz)
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Example: 12"
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          Add Water
        </button>
      </form>

      {formError && <p className="error-text">{formError}</p>}

      <div className="log-list">
        <h3>Today&apos;s logs</h3>
        {!water?.entries?.length ? (
          <p className="muted">No water logged yet for today.</p>
        ) : (
          <ul>
            {water.entries.map((entry) => (
              <li key={entry.id}>
                <span>
                  {entry.amount} oz at {formatTime(entry.created_at)}
                </span>
                <button
                  type="button"
                  className="text-button danger"
                  onClick={() => onDeleteWaterLog(entry.id)}
                  aria-label={`Delete ${entry.amount} ounce water log`}
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
