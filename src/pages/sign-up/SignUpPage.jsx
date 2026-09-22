import AuthFooter from '../../components/auth/shared/AuthFooter';
import AuthLayout from '../../components/auth/shared/AuthLayout';
import AuthPasswordStep from '../../components/auth/shared/steps/AuthPasswordStep';
import OtpVerificationStep from '../../components/auth/shared/steps/OtpVerificationStep';
import ProfileStep from '../../components/auth/sign-up/steps/ProfileStep';
import { ROUTES } from '../../routes';
import {
  SIGN_UP_STEP_CONTENT,
  SIGN_UP_STEP_COUNT,
  SIGN_UP_STEP_LABELS,
  SIGN_UP_STEPS,
} from './constants';
import { useSignUpForm } from './hooks/useSignUpForm';

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

  const { title, description } = SIGN_UP_STEP_CONTENT[currentStep];

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
          <AuthPasswordStep
            formData={formData}
            updateField={updateField}
            onBack={handleBack}
            onContinue={handlePasswordContinue}
            isSubmitting={isSubmitting}
            error={error}
            passwordPlaceholder="Create a password"
            confirmPlaceholder="Re-enter your password"
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
            continueLabel="Verify Email"
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
