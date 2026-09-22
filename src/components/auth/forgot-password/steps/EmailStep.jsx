import { useNavigate } from 'react-router-dom';
import AuthForm from '../../shared/AuthForm';
import AuthFormMessage from '../../shared/AuthFormMessage';
import FormActions from '../../../ui/FormActions';
import TextField from '../../../ui/TextField';
import { ROUTES } from '../../../../routes';

export default function EmailStep({
  formData,
  updateField,
  onContinue,
  isSubmitting = false,
  error = '',
}) {
  const navigate = useNavigate();

  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />

      <TextField
        id="resetEmail"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(event) => updateField('email', event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <FormActions
        onBack={() => navigate(ROUTES.LOGIN)}
        continueLabel="Send Code"
        continueType="submit"
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
