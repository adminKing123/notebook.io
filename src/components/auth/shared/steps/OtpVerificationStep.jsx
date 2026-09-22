import AuthForm from '../AuthForm';
import AuthFormMessage from '../AuthFormMessage';
import OtpVerificationFields from '../OtpVerificationFields';
import FormActions from '../../../ui/FormActions';

export default function OtpVerificationStep({
  email,
  otp,
  onOtpChange,
  onBack,
  onContinue,
  onResend,
  isSubmitting = false,
  error = '',
  successMessage = '',
  continueLabel = 'Verify Code',
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
        continueLabel={continueLabel}
        continueType="submit"
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
