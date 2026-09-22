import AuthFooter from '../../components/auth/shared/AuthFooter';
import AuthLayout from '../../components/auth/shared/AuthLayout';
import AuthPasswordStep from '../../components/auth/shared/steps/AuthPasswordStep';
import OtpVerificationStep from '../../components/auth/shared/steps/OtpVerificationStep';
import EmailStep from '../../components/auth/forgot-password/steps/EmailStep';
import { ROUTES } from '../../routes';
import {
  FORGOT_PASSWORD_STEP_CONTENT,
  FORGOT_PASSWORD_STEP_COUNT,
  FORGOT_PASSWORD_STEP_LABELS,
  FORGOT_PASSWORD_STEPS,
} from './constants';
import { useForgotPasswordForm } from './hooks/useForgotPasswordForm';

export default function ForgotPasswordPage() {
  const {
    currentStep,
    formData,
    updateField,
    isFirstStep,
    isSubmitting,
    error,
    successMessage,
    handleEmailContinue,
    handleOtpContinue,
    handlePasswordContinue,
    handleResendOtp,
    handleBack,
  } = useForgotPasswordForm();

  const { title, description } = FORGOT_PASSWORD_STEP_CONTENT[currentStep];

  const renderStep = () => {
    switch (currentStep) {
      case FORGOT_PASSWORD_STEPS.EMAIL:
        return (
          <EmailStep
            formData={formData}
            updateField={updateField}
            onContinue={handleEmailContinue}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      case FORGOT_PASSWORD_STEPS.OTP:
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
      case FORGOT_PASSWORD_STEPS.PASSWORD:
        return (
          <AuthPasswordStep
            formData={formData}
            updateField={updateField}
            onBack={handleBack}
            onContinue={handlePasswordContinue}
            isSubmitting={isSubmitting}
            error={error}
            passwordLabel="New Password"
            confirmLabel="Confirm New Password"
            passwordPlaceholder="Enter a new password"
            confirmPlaceholder="Re-enter your new password"
            continueLabel="Update Password"
            passwordId="newPassword"
            confirmId="confirmNewPassword"
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
