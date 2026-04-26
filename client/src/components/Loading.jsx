/**
 * Simple loading spinner / text indicator.
 */
export default function Loading({ text = 'Loading...' }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        color: '#8892a8',
        fontSize: '0.95rem',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: '3px solid #e9ecf2',
          borderTopColor: '#d4a843',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 0.75rem',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {text}
    </div>
  );
}
