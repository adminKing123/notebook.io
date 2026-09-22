import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { ROUTES } from '../../../routes';
import { INITIAL_LOGIN_FORM } from '../constants';

function validateLogin(formData) {
  if (!formData.email.trim()) {
    return 'Email address is required.';
  }

  if (!formData.password) {
    return 'Password is required.';
  }

  return '';
}

export function useLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState(INITIAL_LOGIN_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = useCallback((field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setError('');
    const validationError = validateLogin(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, login, navigate]);

  return {
    formData,
    updateField,
    handleSubmit,
    isSubmitting,
    error,
  };
}
