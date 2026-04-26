import { useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import WorkoutCard from '../components/WorkoutCard';
import WaterTracker from '../components/WaterTracker';
import TodoList from '../components/TodoList';
import ReminderList from '../components/ReminderList';

import { workoutApi, waterApi, todoApi, reminderApi } from '../services/api';

export default function Dashboard() {
  const workouts = useFetch(useCallback(() => workoutApi.getAll(), []));
  const water = useFetch(useCallback(() => waterApi.getToday(), []));
  const todos = useFetch(useCallback(() => todoApi.getAll(), []));
  const reminders = useFetch(useCallback(() => reminderApi.getAll(), []));

  const anyLoading = workouts.loading || water.loading || todos.loading || reminders.loading;
  const anyError = workouts.error || water.error || todos.error || reminders.error;

  if (anyLoading) return <Loading text="Loading dashboard..." />;

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      {anyError && (
        <ErrorMessage
          message="Some data could not be loaded. Pull down to refresh."
          onRetry={() => {
            workouts.refetch();
            water.refetch();
            todos.refetch();
            reminders.refetch();
          }}
        />
      )}

      <div className="dashboard-grid">
        <WorkoutCard workouts={workouts.data} onRefresh={workouts.refetch} compact />
        <WaterTracker data={water.data} onRefresh={water.refetch} compact />
        <TodoList todos={todos.data} onRefresh={todos.refetch} compact />
        <ReminderList reminders={reminders.data} onRefresh={reminders.refetch} compact />
      </div>
    </>
  );
}
