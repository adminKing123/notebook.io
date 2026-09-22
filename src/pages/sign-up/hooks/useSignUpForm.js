import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resendSignUpOtp, signUp, verifySignUp } from '../../../api/auth';
import { OTP_RESENT_MESSAGE } from '../../../components/auth/shared/constants';
import { useAuthFormMessages } from '../../../components/auth/shared/hooks/useAuthFormMessages';
import { useStepForm } from '../../../components/auth/shared/hooks/useStepForm';
import { validateOtp, validatePassword } from '../../../components/auth/shared/validators';
import { ROUTES } from '../../../routes';
import { validateDateOfBirth } from '../../../utils/date';
import {
  INITIAL_SIGN_UP_FORM,
  SIGN_UP_STEP_COUNT,
  SIGN_UP_STEPS,
} from '../constants';

function validateProfile(formData) {
  if (!formData.fullName.trim()) {
    return 'Full name is required.';
  }

  const dateOfBirthError = validateDateOfBirth(formData.dateOfBirth);
  if (dateOfBirthError) {
    return dateOfBirthError;
  }

  if (!formData.email.trim()) {
    return 'Email address is required.';
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
  const {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    clearMessages,
  } = useAuthFormMessages();

  const handleProfileContinue = useCallback(() => {
    clearMessages();
    const validationError = validateProfile(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    stepForm.goNext();
  }, [clearMessages, setError, stepForm]);

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
  }, [clearMessages, navigate, setError, setIsSubmitting, stepForm.formData]);

  const handleResendOtp = useCallback(async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      await resendSignUpOtp({ email: stepForm.formData.email });
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
    handleProfileContinue,
    handlePasswordContinue,
    handleOtpContinue,
    handleResendOtp,
    handleBack,
  };
}
