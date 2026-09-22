import { MdGroup, MdLock, MdPublic } from 'react-icons/md';
import AuthForm from '../../auth/shared/AuthForm';
import AuthFormMessage from '../../auth/shared/AuthFormMessage';
import FormActions from '../../ui/FormActions';
import { NOTEBOOK_ACCESS } from '../../notebooks/constants';
import { NOTEBOOK_ACCESS_OPTIONS } from '../constants';

const ACCESS_ICONS = {
  [NOTEBOOK_ACCESS.PRIVATE]: MdLock,
  [NOTEBOOK_ACCESS.PUBLIC]: MdPublic,
  [NOTEBOOK_ACCESS.SHARED]: MdGroup,
};

export default function AccessStep({
  formData,
  updateField,
  onBack,
  onContinue,
  error = '',
}) {
  return (
    <AuthForm onSubmit={onContinue}>
      <AuthFormMessage message={error} />

      <fieldset className="create-notebook-access">
        <legend className="create-notebook-access__legend">Access mode</legend>

        <div className="create-notebook-access__options">
          {NOTEBOOK_ACCESS_OPTIONS.map((option) => {
            const Icon = ACCESS_ICONS[option.value];
            const isSelected = formData.access === option.value;

            return (
              <label
                key={option.value}
                className={
                  isSelected
                    ? 'create-notebook-access__option create-notebook-access__option--selected'
                    : 'create-notebook-access__option'
                }
              >
                <input
                  type="radio"
                  name="notebookAccess"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => updateField('access', option.value)}
                  className="create-notebook-access__input"
                />

                <span className="create-notebook-access__icon" aria-hidden="true">
                  <Icon />
                </span>

                <span className="create-notebook-access__content">
                  <span className="create-notebook-access__label">{option.label}</span>
                  <span className="create-notebook-access__description">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <FormActions onBack={onBack} continueLabel="Continue" continueType="submit" onContinue={onContinue} />
    </AuthForm>
  );
}
