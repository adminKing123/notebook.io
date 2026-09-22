import AuthFooter from '../components/auth/shared/AuthFooter';
import AuthForm from '../components/auth/shared/AuthForm';
import AuthFormMessage from '../components/auth/shared/AuthFormMessage';
import AuthInlineLink from '../components/auth/shared/AuthInlineLink';
import AuthLayout from '../components/auth/shared/AuthLayout';
import FormActions from '../components/ui/FormActions';
import PasswordField from '../components/ui/PasswordField';
import TextField from '../components/ui/TextField';
import { ROUTES } from '../routes';
import { useLoginForm } from './login/hooks/useLoginForm';

export default function LoginPage() {
  const { formData, updateField, handleSubmit, isSubmitting, error } = useLoginForm();

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue writing in your diary."
      showProgress={false}
    >
      <AuthForm onSubmit={handleSubmit}>
        <AuthFormMessage message={error} />

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

        <FormActions
          continueLabel="Sign In"
          continueType="submit"
          onContinue={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </AuthForm>

      <AuthFooter
        text="Don't have an account?"
        linkLabel="Sign up"
        to={ROUTES.SIGN_UP}
      />
    </AuthLayout>
  );
}
