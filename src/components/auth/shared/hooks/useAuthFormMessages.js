import { useCallback, useState } from 'react';

export function useAuthFormMessages() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    clearMessages,
  };
}
