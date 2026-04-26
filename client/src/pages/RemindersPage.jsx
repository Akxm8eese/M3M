import { useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ReminderList from '../components/ReminderList';
import { reminderApi } from '../services/api';

export default function RemindersPage() {
  const { data, loading, error, refetch } = useFetch(
    useCallback(() => reminderApi.getAll(), [])
  );

  return (
    <>
      <h1 className="page-title">Reminders</h1>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && <ReminderList reminders={data} onRefresh={refetch} />}
    </>
  );
}
