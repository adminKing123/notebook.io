import { useCallback, useEffect, useState } from 'react';
import { fetchRecentNotebooks } from '../../../api/notebooks';

export function useRecentNotebooks() {
  const [notebooks, setNotebooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotebooks = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchRecentNotebooks();
      setNotebooks(data);
    } catch (requestError) {
      setError(requestError.message);
      setNotebooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotebooks();
  }, [loadNotebooks]);

  return {
    notebooks,
    isLoading,
    error,
  };
}
