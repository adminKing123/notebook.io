import AuthForm from '../../../components/auth/shared/AuthForm';
import PasswordFieldsStep from '../../../components/auth/shared/steps/PasswordFieldsStep';

export default function PasswordStep({ onContinue, ...props }) {
  return (
    <AuthForm onSubmit={onContinue}>
      <PasswordFieldsStep
        {...props}
        onContinue={onContinue}
        passwordPlaceholder="Create a password"
        confirmPlaceholder="Re-enter your password"
      />
    </AuthForm>
  );
}
