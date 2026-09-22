import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendSignUpOtp, signUp, verifySignUp } from '../../../api/auth';
import { useStepForm } from '../../../components/auth/shared/hooks/useStepForm';
import { ROUTES } from '../../../routes';
import {
  INITIAL_SIGN_UP_FORM,
  SIGN_UP_STEP_COUNT,
  SIGN_UP_STEPS,
} from '../constants';

function validateProfile(formData) {
  if (!formData.fullName.trim()) {
    return 'Full name is required.';
  }

  if (!formData.age) {
    return 'Age is required.';
  }

  const age = Number(formData.age);
  if (Number.isNaN(age) || age < 1 || age > 120) {
    return 'Age must be between 1 and 120.';
  }

  if (!formData.email.trim()) {
    return 'Email address is required.';
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

function validateOtp(formData) {
  if (!/^\d{6}$/.test(formData.otp)) {
    return 'Enter the 6-digit verification code.';
  }

  return '';
}

export function useSignUpForm() {
  const navigate = useNavigate();
  const stepForm = useStepForm({
    initialForm: INITIAL_SIGN_UP_FORM,
    stepCount: SIGN_UP_STEP_COUNT,
    initialStep: SIGN_UP_STEPS.PROFILE,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const handleProfileContinue = useCallback(() => {
    clearMessages();
    const validationError = validateProfile(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    stepForm.goNext();
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
      await signUp(stepForm.formData);
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
      await verifySignUp({
        email: stepForm.formData.email,
        otp: stepForm.formData.otp,
      });
      navigate(ROUTES.LOGIN);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, navigate, stepForm.formData.email, stepForm.formData.otp]);

  const handleResendOtp = useCallback(async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      await resendSignUpOtp({ email: stepForm.formData.email });
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
    isFirstStep: stepForm.currentStep === SIGN_UP_STEPS.PROFILE,
    isLastStep: stepForm.currentStep === SIGN_UP_STEPS.OTP,
    isSubmitting,
    error,
    successMessage,
    handleProfileContinue,
    handlePasswordContinue,
    handleOtpContinue,
    handleResendOtp,
    handleBack,
  };
}
