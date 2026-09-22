import { useNavigate } from 'react-router-dom';
import AuthForm from '../../../components/auth/shared/AuthForm';
import FormActions from '../../../components/ui/FormActions';
import TextField from '../../../components/ui/TextField';
import { ROUTES } from '../../../routes';

export default function EmailStep({ formData, updateField, onContinue }) {
  const navigate = useNavigate();

  return (
    <AuthForm onSubmit={onContinue}>
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
      />
    </AuthForm>
  );
}
