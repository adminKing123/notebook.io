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

  const removeNotebook = useCallback((notebookId) => {
    setNotebooks((previousNotebooks) =>
      previousNotebooks.filter((notebook) => notebook.id !== notebookId),
    );
  }, []);

  const replaceNotebook = useCallback((updatedNotebook) => {
    setNotebooks((previousNotebooks) =>
      previousNotebooks.map((notebook) =>
        notebook.id === updatedNotebook.id ? updatedNotebook : notebook,
      ),
    );
  }, []);

  return {
    notebooks,
    isLoading,
    error,
    removeNotebook,
    replaceNotebook,
  };
}
