import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import { useReminderNotifications } from "./hooks/useReminderNotifications.js";
import { reminderApi, todoApi, waterApi, workoutApi } from "./services/api.js";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [water, setWater] = useState({
    goal: 64,
    total: 0,
    progressPercent: 0,
    remaining: 64,
    entries: [],
  });
  const [todos, setTodos] = useState([]);
  const [reminders, setReminders] = useState([]);

  const {
    supported: notificationSupport,
    permission: notificationPermission,
    requestPermission,
  } = useReminderNotifications(reminders);

  async function loadDashboardData() {
    setError("");
    try {
      const [workoutData, waterData, todoData, reminderData] = await Promise.all([
        workoutApi.getAll(),
        waterApi.getToday(),
        todoApi.getAll(),
        reminderApi.getAll(),
      ]);
      setWorkouts(workoutData);
      setWater(waterData);
      setTodos(todoData);
      setReminders(reminderData);
    } catch (loadError) {
      setError(
        loadError.message ||
          "We could not load AgentFlow right now. Please refresh and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function runMutation(action, fallbackMessage) {
    setSyncing(true);
    setError("");
    try {
      await action();
      await loadDashboardData();
    } catch (mutationError) {
      setError(mutationError.message || fallbackMessage);
      throw mutationError;
    } finally {
      setSyncing(false);
    }
  }

  async function handleEnableNotifications() {
    setNotificationMessage("");
    try {
      const result = await requestPermission();
      if (!result.ok) {
        setNotificationMessage(
          result.message || "Notifications were not enabled."
        );
        return;
      }
      setNotificationMessage("Notifications are now enabled.");
    } catch {
      setNotificationMessage("We could not request notification permissions.");
    }
  }

  return (
    <main className="app-shell">
      <Dashboard
        loading={loading || syncing}
        error={error}
        workouts={workouts}
        water={water}
        todos={todos}
        reminders={reminders}
        onRefresh={loadDashboardData}
        onAddWorkout={(payload) =>
          runMutation(() => workoutApi.create(payload), "Unable to add workout.")
        }
        onDeleteWorkout={(id) =>
          runMutation(() => workoutApi.remove(id), "Unable to delete workout.")
        }
        onAddWater={(amount) =>
          runMutation(() => waterApi.create({ amount }), "Unable to log water.")
        }
        onDeleteWaterLog={(id) =>
          runMutation(() => waterApi.remove(id), "Unable to delete water log.")
        }
        onAddTodo={(payload) =>
          runMutation(() => todoApi.create(payload), "Unable to add task.")
        }
        onToggleTodo={(todo) =>
          runMutation(
            () => todoApi.update(todo.id, { completed: !todo.completed }),
            "Unable to update task."
          )
        }
        onDeleteTodo={(id) =>
          runMutation(() => todoApi.remove(id), "Unable to delete task.")
        }
        onAddReminder={(payload) =>
          runMutation(
            () => reminderApi.create(payload),
            "Unable to add reminder."
          )
        }
        onToggleReminder={(id, completed) =>
          runMutation(
            () => reminderApi.update(id, { completed }),
            "Unable to update reminder."
          )
        }
        onDeleteReminder={(id) =>
          runMutation(() => reminderApi.remove(id), "Unable to delete reminder.")
        }
        notificationSupport={notificationSupport}
        notificationPermission={notificationPermission}
        onEnableNotifications={handleEnableNotifications}
        notificationMessage={notificationMessage}
      />
    </main>
  );
}
