import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import ReminderList from "../components/ReminderList.jsx";
import TodoList from "../components/TodoList.jsx";
import WaterTracker from "../components/WaterTracker.jsx";
import WorkoutCard from "../components/WorkoutCard.jsx";

function upcomingRemindersCount(reminders = []) {
  const now = Date.now();
  return reminders.filter((item) => {
    if (item.completed) return false;
    const timestamp = new Date(item.reminder_time).getTime();
    if (Number.isNaN(timestamp)) return false;
    return timestamp >= now;
  }).length;
}

export default function Dashboard({
  loading,
  syncing,
  error,
  workouts,
  water,
  todos,
  reminders,
  onAddWorkout,
  onDeleteWorkout,
  onAddWater,
  onDeleteWaterLog,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  notificationSupport,
  notificationPermission,
  onEnableNotifications,
  notificationMessage,
  onRefresh,
}) {
  if (loading) {
    return <Loading label="Loading your AgentFlow dashboard..." />;
  }

  return (
    <div className="page-shell">
      <header className="hero-header card">
        <div>
          <p className="eyebrow">AgentFlow</p>
          <h1>Daily productivity dashboard</h1>
          <p className="hero-subtitle">
            Manage workouts, hydration, tasks, and reminders from one place.
          </p>
        </div>
        <button className="button button-secondary" onClick={onRefresh} type="button">
          Refresh
        </button>
      </header>

      <ErrorMessage message={error} />

      <section className="dashboard-summary-grid">
        <article className="summary-card card">
          <h2>Today&apos;s Workouts</h2>
          <p className="summary-number">{workouts.length}</p>
        </article>
        <article className="summary-card card">
          <h2>Water Progress</h2>
          <p className="summary-number">
            {water.total} / {water.goal} oz
          </p>
        </article>
        <article className="summary-card card">
          <h2>Pending Tasks</h2>
          <p className="summary-number">
            {todos.filter((todo) => !todo.completed).length}
          </p>
        </article>
        <article className="summary-card card">
          <h2>Upcoming Reminders</h2>
          <p className="summary-number">{upcomingRemindersCount(reminders)}</p>
        </article>
      </section>

      <section className="dashboard-main-grid">
        <WorkoutCard
          workouts={workouts}
          onAddWorkout={onAddWorkout}
          onDeleteWorkout={onDeleteWorkout}
        />
        <WaterTracker
          water={water}
          onAddWater={onAddWater}
          onDeleteWaterLog={onDeleteWaterLog}
          loading={syncing}
        />
        <TodoList
          todos={todos}
          onCreate={onAddTodo}
          onToggleCompleted={onToggleTodo}
          onDelete={onDeleteTodo}
          loading={syncing}
        />
        <ReminderList
          reminders={reminders}
          onAddReminder={onAddReminder}
          onToggleReminder={onToggleReminder}
          onDeleteReminder={onDeleteReminder}
          notificationSupport={notificationSupport}
          notificationPermission={notificationPermission}
          onEnableNotifications={onEnableNotifications}
          notificationMessage={notificationMessage}
        />
      </section>
    </div>
  );
}
