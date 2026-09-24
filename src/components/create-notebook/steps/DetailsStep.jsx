import AuthForm from '../../auth/shared/AuthForm';
import AuthFormMessage from '../../auth/shared/AuthFormMessage';
import FormActions from '../../ui/FormActions';
import TextAreaField from '../../ui/TextAreaField';
import TextField from '../../ui/TextField';

export default function DetailsStep({
  formData,
  updateField,
  onBack,
  backLabel = 'Back',
  onContinue,
  error = '',
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />

      <TextField
        id="notebookTitle"
        label="Title"
        value={formData.title}
        onChange={(event) => updateField('title', event.target.value)}
        placeholder="Morning Pages"
        autoComplete="off"
      />

      <TextAreaField
        id="notebookDescription"
        label="Description"
        value={formData.description}
        onChange={(event) => updateField('description', event.target.value)}
        placeholder="What is this notebook about?"
        rows={4}
      />

      <FormActions
        onBack={onBack}
        backLabel={backLabel}
        continueLabel="Continue"
        continueType="submit"
        onContinue={onContinue}
      />
    </AuthForm>
  );
}
