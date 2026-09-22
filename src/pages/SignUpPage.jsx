import AuthFooter from '../components/auth/shared/AuthFooter';
import AuthFormMessage from '../components/auth/shared/AuthFormMessage';
import AuthLayout from '../components/auth/shared/AuthLayout';
import {
  SIGN_UP_STEP_COUNT,
  SIGN_UP_STEP_LABELS,
  SIGN_UP_STEPS,
} from './sign-up/constants';
import { useSignUpForm } from './sign-up/hooks/useSignUpForm';
import OtpVerificationStep from './sign-up/steps/OtpVerificationStep';
import PasswordStep from './sign-up/steps/PasswordStep';
import ProfileStep from './sign-up/steps/ProfileStep';
import { ROUTES } from '../routes';

const STEP_CONTENT = {
  [SIGN_UP_STEPS.PROFILE]: {
    title: 'Create your account',
    description: 'Tell us a little about yourself to get started.',
  },
  [SIGN_UP_STEPS.PASSWORD]: {
    title: 'Secure your account',
    description: 'Choose a strong password to protect your diary.',
  },
  [SIGN_UP_STEPS.OTP]: {
    title: 'Verify your email',
    description: 'Enter the code we sent to confirm your email address.',
  },
};

export default function SignUpPage() {
  const {
    currentStep,
    formData,
    updateField,
    isFirstStep,
    isSubmitting,
    error,
    successMessage,
    handleProfileContinue,
    handlePasswordContinue,
    handleOtpContinue,
    handleResendOtp,
    handleBack,
  } = useSignUpForm();

  const { title, description } = STEP_CONTENT[currentStep];

  const renderStep = () => {
    switch (currentStep) {
      case SIGN_UP_STEPS.PROFILE:
        return (
          <ProfileStep
            formData={formData}
            updateField={updateField}
            onContinue={handleProfileContinue}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      case SIGN_UP_STEPS.PASSWORD:
        return (
          <PasswordStep
            formData={formData}
            updateField={updateField}
            onBack={handleBack}
            onContinue={handlePasswordContinue}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      case SIGN_UP_STEPS.OTP:
        return (
          <OtpVerificationStep
            email={formData.email}
            otp={formData.otp}
            onOtpChange={(value) => updateField('otp', value)}
            onBack={handleBack}
            onContinue={handleOtpContinue}
            onResend={handleResendOtp}
            isSubmitting={isSubmitting}
            error={error}
            successMessage={successMessage}
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
      stepCount={SIGN_UP_STEP_COUNT}
      stepLabels={SIGN_UP_STEP_LABELS}
    >
      {renderStep()}

      {isFirstStep && (
        <AuthFooter
          text="Already have an account?"
          linkLabel="Sign in"
          to={ROUTES.LOGIN}
        />
      )}
    </AuthLayout>
  );
}
