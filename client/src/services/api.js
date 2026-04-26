/**
 * Thin wrapper around fetch for the AgentFlow API.
 * In development Vite proxies /api to the Express backend.
 * In production VITE_API_URL is set to the deployed API URL.
 */

const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// ─── Workouts ────────────────────────────────────────
export const workoutApi = {
  getAll: () => request('/api/workouts'),
  create: (body) => request('/api/workouts', { method: 'POST', body: JSON.stringify(body) }),
  remove: (id) => request(`/api/workouts/${id}`, { method: 'DELETE' }),
};

// ─── Water ───────────────────────────────────────────
export const waterApi = {
  getToday: () => request('/api/water/today'),
  add: (amount) => request('/api/water', { method: 'POST', body: JSON.stringify({ amount }) }),
  remove: (id) => request(`/api/water/${id}`, { method: 'DELETE' }),
};

// ─── Todos ───────────────────────────────────────────
export const todoApi = {
  getAll: () => request('/api/todos'),
  create: (body) => request('/api/todos', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/api/todos/${id}`, { method: 'DELETE' }),
};

// ─── Reminders ───────────────────────────────────────
export const reminderApi = {
  getAll: () => request('/api/reminders'),
  create: (body) => request('/api/reminders', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/reminders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/api/reminders/${id}`, { method: 'DELETE' }),
};
