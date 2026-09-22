import AuthFooter from '../components/auth/shared/AuthFooter';
import AuthLayout from '../components/auth/shared/AuthLayout';
import {
  FORGOT_PASSWORD_STEP_COUNT,
  FORGOT_PASSWORD_STEP_LABELS,
  FORGOT_PASSWORD_STEPS,
} from './forgot-password/constants';
import { useForgotPasswordForm } from './forgot-password/hooks/useForgotPasswordForm';
import EmailStep from './forgot-password/steps/EmailStep';
import OtpStep from './forgot-password/steps/OtpStep';
import ResetPasswordStep from './forgot-password/steps/ResetPasswordStep';
import { ROUTES } from '../routes';

const STEP_CONTENT = {
  [FORGOT_PASSWORD_STEPS.EMAIL]: {
    title: 'Reset your password',
    description: 'Enter the email address linked to your account.',
  },
  [FORGOT_PASSWORD_STEPS.OTP]: {
    title: 'Verify your email',
    description: 'Enter the code we sent to verify it is really you.',
  },
  [FORGOT_PASSWORD_STEPS.PASSWORD]: {
    title: 'Create a new password',
    description: 'Choose a new password for your account.',
  },
};

export default function ForgotPasswordPage() {
  const {
    currentStep,
    formData,
    updateField,
    goNext,
    goBack,
    isFirstStep,
  } = useForgotPasswordForm();

  const { title, description } = STEP_CONTENT[currentStep];

  const renderStep = () => {
    switch (currentStep) {
      case FORGOT_PASSWORD_STEPS.EMAIL:
        return (
          <EmailStep
            formData={formData}
            updateField={updateField}
            onContinue={goNext}
          />
        );
      case FORGOT_PASSWORD_STEPS.OTP:
        return (
          <OtpStep
            email={formData.email}
            otp={formData.otp}
            onOtpChange={(value) => updateField('otp', value)}
            onBack={goBack}
            onContinue={goNext}
          />
        );
      case FORGOT_PASSWORD_STEPS.PASSWORD:
        return (
          <ResetPasswordStep
            formData={formData}
            updateField={updateField}
            onBack={goBack}
            onContinue={goNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title={title}
      description={description}
      currentStep={currentStep}
      stepCount={FORGOT_PASSWORD_STEP_COUNT}
      stepLabels={FORGOT_PASSWORD_STEP_LABELS}
    >
      {renderStep()}

      {isFirstStep && (
        <AuthFooter
          text="Remember your password?"
          linkLabel="Sign in"
          to={ROUTES.LOGIN}
        />
      )}
    </AuthLayout>
  );
}
