import { useStepForm } from '../../../components/auth/shared/hooks/useStepForm';
import {
  INITIAL_SIGN_UP_FORM,
  SIGN_UP_STEP_COUNT,
  SIGN_UP_STEPS,
} from '../constants';

export function useSignUpForm() {
  const stepForm = useStepForm({
    initialForm: INITIAL_SIGN_UP_FORM,
    stepCount: SIGN_UP_STEP_COUNT,
    initialStep: SIGN_UP_STEPS.PROFILE,
  });

  return {
    ...stepForm,
    isFirstStep: stepForm.currentStep === SIGN_UP_STEPS.PROFILE,
    isLastStep: stepForm.currentStep === SIGN_UP_STEPS.OTP,
  };
}
