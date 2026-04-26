import { useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import WaterTracker from '../components/WaterTracker';
import { waterApi } from '../services/api';

export default function WaterPage() {
  const { data, loading, error, refetch } = useFetch(
    useCallback(() => waterApi.getToday(), [])
  );

  return (
    <>
      <h1 className="page-title">Water Intake</h1>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && <WaterTracker data={data} onRefresh={refetch} />}
    </>
  );
}
