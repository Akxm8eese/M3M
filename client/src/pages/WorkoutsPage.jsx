import { useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import WorkoutCard from '../components/WorkoutCard';
import { workoutApi } from '../services/api';

export default function WorkoutsPage() {
  const { data, loading, error, refetch } = useFetch(
    useCallback(() => workoutApi.getAll(), [])
  );

  return (
    <>
      <h1 className="page-title">Workout Tracker</h1>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && <WorkoutCard workouts={data} onRefresh={refetch} />}
    </>
  );
}
