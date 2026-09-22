import AuthForm from '../../shared/AuthForm';
import AuthFormMessage from '../../shared/AuthFormMessage';
import DateField from '../../../ui/DateField';
import FormActions from '../../../ui/FormActions';
import TextField from '../../../ui/TextField';

export default function ProfileStep({
  formData,
  updateField,
  onContinue,
  isSubmitting = false,
  error = '',
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />
      <TextField
        id="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={(event) => updateField('fullName', event.target.value)}
        placeholder="Enter your full name"
        autoComplete="name"
      />

      <DateField
        id="dateOfBirth"
        label="Date of Birth"
        value={formData.dateOfBirth}
        onChange={(event) => updateField('dateOfBirth', event.target.value)}
      />

      <TextField
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(event) => updateField('email', event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <FormActions
        continueLabel="Continue"
        continueType="submit"
        onContinue={onContinue}
        isSubmitting={isSubmitting}
      />
    </AuthForm>
  );
}
