import { useState } from 'react';
import AuthFooter from '../components/auth/shared/AuthFooter';
import AuthForm from '../components/auth/shared/AuthForm';
import AuthInlineLink from '../components/auth/shared/AuthInlineLink';
import AuthLayout from '../components/auth/shared/AuthLayout';
import FormActions from '../components/ui/FormActions';
import PasswordField from '../components/ui/PasswordField';
import TextField from '../components/ui/TextField';
import { INITIAL_LOGIN_FORM } from './login/constants';
import { ROUTES } from '../routes';

export default function LoginPage() {
  const [formData, setFormData] = useState(INITIAL_LOGIN_FORM);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = () => {};

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue writing in your diary."
      showProgress={false}
    >
      <AuthForm onSubmit={handleSubmit}>
        <TextField
          id="loginEmail"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <PasswordField
          id="loginPassword"
          label="Password"
          value={formData.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <AuthInlineLink to={ROUTES.FORGOT_PASSWORD}>
          Forgot password?
        </AuthInlineLink>

        <FormActions continueLabel="Sign In" continueType="submit" onContinue={handleSubmit} />
      </AuthForm>

      <AuthFooter
        text="Don't have an account?"
        linkLabel="Sign up"
        to={ROUTES.SIGN_UP}
      />
    </AuthLayout>
  );
}
