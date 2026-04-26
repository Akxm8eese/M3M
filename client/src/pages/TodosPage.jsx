import { useCallback } from 'react';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import TodoList from '../components/TodoList';
import { todoApi } from '../services/api';

export default function TodosPage() {
  const { data, loading, error, refetch } = useFetch(
    useCallback(() => todoApi.getAll(), [])
  );

  return (
    <>
      <h1 className="page-title">Todo Checklist</h1>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && <TodoList todos={data} onRefresh={refetch} />}
    </>
  );
}
