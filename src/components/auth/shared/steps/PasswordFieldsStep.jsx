import FormActions from '../../../ui/FormActions';
import PasswordField from '../../../ui/PasswordField';

export default function PasswordFieldsStep({
  formData,
  updateField,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  passwordLabel = 'Password',
  confirmLabel = 'Confirm Password',
  passwordPlaceholder = 'Enter your password',
  confirmPlaceholder = 'Re-enter your password',
  passwordId = 'password',
  confirmId = 'confirmPassword',
}) {
  return (
    <>
      <PasswordField
        id={passwordId}
        label={passwordLabel}
        value={formData.password}
        onChange={(event) => updateField('password', event.target.value)}
        placeholder={passwordPlaceholder}
        autoComplete="new-password"
      />

      <PasswordField
        id={confirmId}
        label={confirmLabel}
        value={formData.confirmPassword}
        onChange={(event) => updateField('confirmPassword', event.target.value)}
        placeholder={confirmPlaceholder}
        autoComplete="new-password"
      />

      <FormActions
        onBack={onBack}
        continueLabel={continueLabel}
        continueType="submit"
        onContinue={onContinue}
      />
    </>
  );
}
