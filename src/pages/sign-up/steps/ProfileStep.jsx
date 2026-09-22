import AuthForm from '../../../components/auth/shared/AuthForm';
import FormActions from '../../../components/ui/FormActions';
import TextField from '../../../components/ui/TextField';

export default function ProfileStep({ formData, updateField, onContinue }) {
  return (
    <AuthForm onSubmit={onContinue}>
      <TextField
        id="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={(event) => updateField('fullName', event.target.value)}
        placeholder="Enter your full name"
        autoComplete="name"
      />

      <TextField
        id="age"
        label="Age"
        type="number"
        value={formData.age}
        onChange={(event) => updateField('age', event.target.value)}
        placeholder="Enter your age"
        min={1}
        max={120}
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

      <FormActions continueLabel="Continue" continueType="submit" onContinue={onContinue} />
    </AuthForm>
  );
}
