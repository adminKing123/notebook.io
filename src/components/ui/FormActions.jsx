import Button from './Button';
import './forms.css';

export default function FormActions({
  onBack,
  onContinue,
  continueLabel = 'Continue',
  backLabel = 'Back',
  continueType = 'button',
  isSubmitting = false,
}) {
  return (
    <div className="ui-form-actions">
      {onBack && (
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>
          {backLabel}
        </Button>
      )}
      <Button type={continueType} onClick={onContinue} disabled={isSubmitting}>
        {isSubmitting ? 'Please wait...' : continueLabel}
      </Button>
    </div>
  );
}
