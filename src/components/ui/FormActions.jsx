import Button from './Button';
import './forms.css';

export default function FormActions({
  onBack,
  onContinue,
  continueLabel = 'Continue',
  backLabel = 'Back',
  continueType = 'button',
}) {
  return (
    <div className="ui-form-actions">
      {onBack && (
        <Button variant="secondary" onClick={onBack}>
          {backLabel}
        </Button>
      )}
      <Button type={continueType} onClick={onContinue}>
        {continueLabel}
      </Button>
    </div>
  );
}
