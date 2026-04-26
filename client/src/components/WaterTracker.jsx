import { useState } from 'react';
import { waterApi } from '../services/api';
import ErrorMessage from './ErrorMessage';

const DAILY_GOAL = 64; // oz
const QUICK_AMOUNTS = [8, 12, 16, 24];

export default function WaterTracker({ data, onRefresh, compact }) {
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = data?.total ?? 0;
  const pct = Math.min(Math.round((total / DAILY_GOAL) * 100), 100);

  const addAmount = async (amount) => {
    setError('');
    setSubmitting(true);
    try {
      await waterApi.add(amount);
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustom = (e) => {
    e.preventDefault();
    const val = Number(custom);
    if (!val || val <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    addAmount(val);
    setCustom('');
  };

  const handleDelete = async (id) => {
    try {
      await waterApi.remove(id);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-title">💧 Water Intake</div>

      <ErrorMessage message={error} />

      {/* Progress bar */}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="progress-label">
        {total} / {DAILY_GOAL} oz ({pct}%)
      </p>

      {!compact && (
        <>
          {/* Quick-add buttons */}
          <div className="water-quick-btns mt-1">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                className="btn btn-secondary btn-sm"
                onClick={() => addAmount(amt)}
                disabled={submitting}
              >
                +{amt} oz
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <form onSubmit={handleCustom} className="form-row" style={{ alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Custom (oz)</label>
              <input
                className="form-control"
                type="number"
                min="1"
                placeholder="e.g. 20"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              style={{ marginBottom: '0.75rem' }}
              disabled={submitting}
            >
              Add
            </button>
          </form>

          {/* Today's log */}
          {data?.logs?.length > 0 && (
            <div className="scrollable-list mt-1">
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Today's log
              </p>
              {data.logs.map((l) => (
                <div
                  key={l.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.35rem 0',
                    borderBottom: '1px solid var(--gray-100)',
                    fontSize: '0.85rem',
                  }}
                >
                  <span>
                    {parseFloat(l.amount)} oz —{' '}
                    {new Date(l.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button className="btn-icon" onClick={() => handleDelete(l.id)} title="Remove">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
