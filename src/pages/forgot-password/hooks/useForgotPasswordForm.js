import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  requestPasswordReset,
  resetPassword,
  resendPasswordResetOtp,
  verifyPasswordResetOtp,
} from '../../../api/auth';
import { useStepForm } from '../../../components/auth/shared/hooks/useStepForm';
import { ROUTES } from '../../../routes';
import {
  FORGOT_PASSWORD_STEP_COUNT,
  FORGOT_PASSWORD_STEPS,
  INITIAL_FORGOT_PASSWORD_FORM,
} from '../constants';

function validateEmail(formData) {
  if (!formData.email.trim()) {
    return 'Email address is required.';
  }

  return '';
}

function validateOtp(formData) {
  if (!/^\d{6}$/.test(formData.otp)) {
    return 'Enter the 6-digit verification code.';
  }

  return '';
}

function validatePassword(formData) {
  if (!formData.password) {
    return 'Password is required.';
  }

  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.';
  }

  return '';
}

export function useForgotPasswordForm() {
  const navigate = useNavigate();
  const stepForm = useStepForm({
    initialForm: INITIAL_FORGOT_PASSWORD_FORM,
    stepCount: FORGOT_PASSWORD_STEP_COUNT,
    initialStep: FORGOT_PASSWORD_STEPS.EMAIL,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const handleEmailContinue = useCallback(async () => {
    clearMessages();
    const validationError = validateEmail(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset({ email: stepForm.formData.email.trim() });
      stepForm.goNext();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, stepForm]);

  const handleOtpContinue = useCallback(async () => {
    clearMessages();
    const validationError = validateOtp(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyPasswordResetOtp({
        email: stepForm.formData.email.trim(),
        otp: stepForm.formData.otp,
      });
      stepForm.goNext();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, stepForm]);

  const handlePasswordContinue = useCallback(async () => {
    clearMessages();
    const validationError = validatePassword(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email: stepForm.formData.email.trim(),
        otp: stepForm.formData.otp,
        password: stepForm.formData.password,
        confirmPassword: stepForm.formData.confirmPassword,
      });
      navigate(ROUTES.LOGIN);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, navigate, stepForm.formData]);

  const handleResendOtp = useCallback(async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      await resendPasswordResetOtp({ email: stepForm.formData.email.trim() });
      setSuccessMessage('A new verification code has been sent to your email.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, stepForm.formData.email]);

  const handleBack = useCallback(() => {
    clearMessages();
    stepForm.goBack();
  }, [clearMessages, stepForm]);

  return {
    ...stepForm,
    isFirstStep: stepForm.currentStep === FORGOT_PASSWORD_STEPS.EMAIL,
    isLastStep: stepForm.currentStep === FORGOT_PASSWORD_STEPS.PASSWORD,
    isSubmitting,
    error,
    successMessage,
    handleEmailContinue,
    handleOtpContinue,
    handlePasswordContinue,
    handleResendOtp,
    handleBack,
  };
}
