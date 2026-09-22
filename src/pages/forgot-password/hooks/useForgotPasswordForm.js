import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  requestPasswordReset,
  resetPassword,
  resendPasswordResetOtp,
  verifyPasswordResetOtp,
} from '../../../api/auth';
import { OTP_RESENT_MESSAGE } from '../../../components/auth/shared/constants';
import { useAuthFormMessages } from '../../../components/auth/shared/hooks/useAuthFormMessages';
import { useStepForm } from '../../../components/auth/shared/hooks/useStepForm';
import {
  validateEmail,
  validateOtp,
  validatePassword,
} from '../../../components/auth/shared/validators';
import { ROUTES } from '../../../routes';
import {
  FORGOT_PASSWORD_STEP_COUNT,
  FORGOT_PASSWORD_STEPS,
  INITIAL_FORGOT_PASSWORD_FORM,
} from '../constants';

export function useForgotPasswordForm() {
  const navigate = useNavigate();
  const stepForm = useStepForm({
    initialForm: INITIAL_FORGOT_PASSWORD_FORM,
    stepCount: FORGOT_PASSWORD_STEP_COUNT,
    initialStep: FORGOT_PASSWORD_STEPS.EMAIL,
  });
  const {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    clearMessages,
  } = useAuthFormMessages();

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
  }, [clearMessages, setError, setIsSubmitting, stepForm]);

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
  }, [clearMessages, setError, setIsSubmitting, stepForm]);

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
  }, [clearMessages, navigate, setError, setIsSubmitting, stepForm.formData]);

  const handleResendOtp = useCallback(async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      await resendPasswordResetOtp({ email: stepForm.formData.email.trim() });
      setSuccessMessage(OTP_RESENT_MESSAGE);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, setError, setIsSubmitting, setSuccessMessage, stepForm.formData.email]);

  const handleBack = useCallback(() => {
    clearMessages();
    stepForm.goBack();
  }, [clearMessages, stepForm]);

  return {
    currentStep: stepForm.currentStep,
    formData: stepForm.formData,
    updateField: stepForm.updateField,
    isFirstStep: stepForm.isFirstStep,
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
