import AuthForm from '../../../components/auth/shared/AuthForm';
import AuthFormMessage from '../../../components/auth/shared/AuthFormMessage';
import PasswordFieldsStep from '../../../components/auth/shared/steps/PasswordFieldsStep';

export default function ResetPasswordStep({
  onContinue,
  error = '',
  isSubmitting = false,
  ...props
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />
      <PasswordFieldsStep
        {...props}
        onContinue={onContinue}
        isSubmitting={isSubmitting}
        passwordLabel="New Password"
        confirmLabel="Confirm New Password"
        passwordPlaceholder="Enter a new password"
        confirmPlaceholder="Re-enter your new password"
        continueLabel="Update Password"
        passwordId="newPassword"
        confirmId="confirmNewPassword"
      />
    </AuthForm>
  );
}
