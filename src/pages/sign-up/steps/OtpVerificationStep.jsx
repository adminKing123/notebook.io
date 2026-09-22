import AuthForm from '../../../components/auth/shared/AuthForm';
import OtpVerificationFields from '../../../components/auth/shared/OtpVerificationFields';
import FormActions from '../../../components/ui/FormActions';

export default function OtpVerificationStep({
  email,
  otp,
  onOtpChange,
  onBack,
  onContinue,
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <OtpVerificationFields email={email} otp={otp} onOtpChange={onOtpChange} />

      <FormActions
        onBack={onBack}
        continueLabel="Verify Email"
        continueType="submit"
        onContinue={onContinue}
      />
    </AuthForm>
  );
}
