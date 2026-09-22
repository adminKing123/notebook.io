import { useStepForm } from '../../../components/auth/shared/hooks/useStepForm';
import {
  FORGOT_PASSWORD_STEP_COUNT,
  FORGOT_PASSWORD_STEPS,
  INITIAL_FORGOT_PASSWORD_FORM,
} from '../constants';

export function useForgotPasswordForm() {
  const stepForm = useStepForm({
    initialForm: INITIAL_FORGOT_PASSWORD_FORM,
    stepCount: FORGOT_PASSWORD_STEP_COUNT,
    initialStep: FORGOT_PASSWORD_STEPS.EMAIL,
  });

  return {
    ...stepForm,
    isFirstStep: stepForm.currentStep === FORGOT_PASSWORD_STEPS.EMAIL,
    isLastStep: stepForm.currentStep === FORGOT_PASSWORD_STEPS.PASSWORD,
  };
}
