import { useMemo, useState } from "react";

function formatDateTimeLocal(isoString) {
  if (!isoString) return "No date";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString();
}

function getDateTimeValueForInput(dateLike) {
  const date = new Date(dateLike || Date.now() + 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const pad = (value) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function ReminderList({
  reminders = [],
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  notificationSupport,
  notificationPermission,
  onEnableNotifications,
  notificationMessage,
}) {
  const [title, setTitle] = useState("");
  const [reminderTime, setReminderTime] = useState(getDateTimeValueForInput());
  const [submitting, setSubmitting] = useState(false);

  const upcomingCount = useMemo(
    () =>
      reminders.filter((item) => {
        if (item.completed) return false;
        const timestamp = new Date(item.reminder_time).getTime();
        return !Number.isNaN(timestamp) && timestamp >= Date.now();
      }).length,
    [reminders]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if (!title.trim()) {
      window.alert("Please add a reminder title.");
      return;
    }
    if (!reminderTime) {
      window.alert("Please choose a reminder date and time.");
      return;
    }

    setSubmitting(true);
    try {
      await onAddReminder({
        title: title.trim(),
        reminder_time: new Date(reminderTime).toISOString(),
      });
      setTitle("");
      setReminderTime(getDateTimeValueForInput());
    } catch (error) {
      window.alert(error.message || "Unable to save reminder.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <div className="section-header">
        <h2>Reminders</h2>
        <span className="stat-pill">{upcomingCount} upcoming</span>
      </div>

      <form className="stack-sm" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Call back policyholder"
            required
          />
        </label>
        <label className="field">
          <span>Date & time</span>
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(event) => setReminderTime(event.target.value)}
            required
          />
        </label>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add Reminder"}
        </button>
      </form>

      <div className="notifications-box">
        <strong>Browser notifications</strong>
        {!notificationSupport && (
          <p className="muted-text">
            Your browser does not support notifications. Reminders still appear
            in your list.
          </p>
        )}
        {notificationSupport && notificationPermission !== "granted" && (
          <button
            className="btn-secondary"
            onClick={onEnableNotifications}
            type="button"
          >
            Enable Notifications
          </button>
        )}
        {notificationSupport && notificationPermission === "granted" && (
          <p className="success-text">Notifications enabled.</p>
        )}
        {notificationMessage ? <p className="muted-text">{notificationMessage}</p> : null}
      </div>

      <ul className="list">
        {reminders.length === 0 && (
          <li className="empty-state">
            No reminders yet. Add one to avoid missing follow-ups.
          </li>
        )}
        {reminders.map((reminder) => (
          <li key={reminder.id} className="list-item">
            <div>
              <p className={`item-title ${reminder.completed ? "done" : ""}`}>
                {reminder.title}
              </p>
              <p className="muted-text">
                {formatDateTimeLocal(reminder.reminder_time)}
              </p>
            </div>
            <div className="inline-actions">
              <button
                className="btn-secondary"
                onClick={() =>
                  onToggleReminder(reminder.id, !Boolean(reminder.completed))
                }
                type="button"
              >
                {reminder.completed ? "Reopen" : "Done"}
              </button>
              <button
                className="btn-danger"
                onClick={() => onDeleteReminder(reminder.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
