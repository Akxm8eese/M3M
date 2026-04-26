import { useMemo, useState } from "react";

const PRIORITIES = ["low", "medium", "high"];

function formatDate(dateValue) {
  if (!dateValue) return "No due date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No due date";
  return date.toLocaleDateString();
}

export default function TodoList({
  todos,
  onCreate,
  onToggleCompleted,
  onDelete,
  loading,
}) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Task text is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        text: text.trim(),
        priority,
        due_date: dueDate || null,
      });
      setText("");
      setPriority("medium");
      setDueDate("");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Todo Checklist</h2>
        <span className="pill">{pendingCount} pending</span>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field">
          Task
          <input
            type="text"
            placeholder="Call client about policy renewal"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={255}
          />
        </label>

        <div className="row two-cols">
          <label className="field">
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              {PRIORITIES.map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>
                  {priorityOption[0].toUpperCase() + priorityOption.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </label>
        </div>

        {error ? <p className="inline-error">{error}</p> : null}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add Task"}
        </button>
      </form>

      <ul className="list">
        {loading ? <li className="muted">Loading tasks...</li> : null}
        {!loading && todos.length === 0 ? (
          <li className="muted">No tasks yet. Start with your top priority.</li>
        ) : null}
        {todos.map((todo) => (
          <li key={todo.id} className={`list-item ${todo.completed ? "done" : ""}`}>
            <div className="list-item-main">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggleCompleted(todo)}
                />
                <span>{todo.text}</span>
              </label>
              <p className="meta">
                <strong className={`priority ${todo.priority}`}>
                  {todo.priority}
                </strong>{" "}
                · {formatDate(todo.due_date)}
              </p>
            </div>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
