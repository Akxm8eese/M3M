/**
 * Displays a user-friendly error banner.
 * Pass an `onRetry` callback to show a retry button.
 */
export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={{
        background: '#fed7d7',
        color: '#c53030',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ flex: 1 }}>⚠ {message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-danger" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
