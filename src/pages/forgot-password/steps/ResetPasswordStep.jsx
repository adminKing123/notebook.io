import AuthForm from '../../../components/auth/shared/AuthForm';
import PasswordFieldsStep from '../../../components/auth/shared/steps/PasswordFieldsStep';

export default function ResetPasswordStep({ onContinue, ...props }) {
  return (
    <AuthForm onSubmit={onContinue}>
      <PasswordFieldsStep
        {...props}
        onContinue={onContinue}
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
