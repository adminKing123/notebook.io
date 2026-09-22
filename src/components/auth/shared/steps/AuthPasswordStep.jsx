import AuthForm from '../AuthForm';
import AuthFormMessage from '../AuthFormMessage';
import PasswordFieldsStep from './PasswordFieldsStep';

export default function AuthPasswordStep({
  onContinue,
  error = '',
  isSubmitting = false,
  ...passwordFieldProps
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />
      <PasswordFieldsStep
        {...passwordFieldProps}
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
