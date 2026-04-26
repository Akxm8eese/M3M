const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong. Please try again.";
    try {
      const errorBody = await response.json();
      errorMessage =
        errorBody?.error || errorBody?.message || errorMessage;
    } catch {
      // Ignore parsing errors and keep fallback message.
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const workoutApi = {
  getAll: () => request("/workouts"),
  create: (payload) =>
    request("/workouts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/workouts/${id}`, {
      method: "DELETE",
    }),
};

export const waterApi = {
  getToday: () => request("/water/today"),
  create: (payload) =>
    request("/water", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/water/${id}`, {
      method: "DELETE",
    }),
};

export const todoApi = {
  getAll: () => request("/todos"),
  create: (payload) =>
    request("/todos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/todos/${id}`, {
      method: "DELETE",
    }),
};

export const reminderApi = {
  getAll: () => request("/reminders"),
  create: (payload) =>
    request("/reminders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/reminders/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/reminders/${id}`, {
      method: "DELETE",
    }),
};
