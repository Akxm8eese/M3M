import { useEffect, useRef } from "react";

function buildNotificationBody(reminderTime) {
  const date = new Date(reminderTime);
  if (Number.isNaN(date.getTime())) {
    return "You have a reminder ready in AgentFlow.";
  }
  return `Scheduled for ${date.toLocaleString()}`;
}

export function useReminderNotifications(reminders = []) {
  const timersRef = useRef([]);
  const shownRef = useRef(new Set());

  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (!("Notification" in window)) {
      return undefined;
    }

    reminders.forEach((reminder) => {
      if (reminder.completed) return;
      if (!reminder.reminder_time) return;

      const dueAt = new Date(reminder.reminder_time).getTime();
      if (Number.isNaN(dueAt)) return;

      const delay = dueAt - Date.now();
      if (delay < 0 || shownRef.current.has(reminder.id)) return;

      const timerId = window.setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(reminder.title, {
            body: buildNotificationBody(reminder.reminder_time),
          });
        }
        shownRef.current.add(reminder.id);
      }, delay);

      timersRef.current.push(timerId);
    });

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [reminders]);

  async function requestPermission() {
    if (!("Notification" in window)) {
      return { ok: false, message: "This browser does not support notifications." };
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { ok: false, message: "Notifications were not enabled." };
    }
    return { ok: true };
  }

  return {
    supported: "Notification" in window,
    permission: "Notification" in window ? Notification.permission : "denied",
    requestPermission,
  };
}
