import AuthForm from '../../../components/auth/shared/AuthForm';
import AuthFormMessage from '../../../components/auth/shared/AuthFormMessage';
import OtpVerificationFields from '../../../components/auth/shared/OtpVerificationFields';
import FormActions from '../../../components/ui/FormActions';

export default function OtpStep({
  email,
  otp,
  onOtpChange,
  onBack,
  onContinue,
  onResend,
  isSubmitting = false,
  error = '',
  successMessage = '',
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />
      <AuthFormMessage message={successMessage} variant="success" />
      <OtpVerificationFields
        email={email}
        otp={otp}
        onOtpChange={onOtpChange}
        onResend={onResend}
        isResending={isSubmitting}
      />

      <FormActions
        onBack={onBack}
        continueLabel="Verify Code"
        continueType="submit"
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
