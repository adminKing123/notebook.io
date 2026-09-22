import AuthForm from '../../../components/auth/shared/AuthForm';
import AuthFormMessage from '../../../components/auth/shared/AuthFormMessage';
import PasswordFieldsStep from '../../../components/auth/shared/steps/PasswordFieldsStep';

export default function PasswordStep({
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
        passwordPlaceholder="Create a password"
        confirmPlaceholder="Re-enter your password"
      />
    </AuthForm>
  );
}
