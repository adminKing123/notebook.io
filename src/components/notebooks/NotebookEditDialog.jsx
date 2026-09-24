import AuthStepIndicator from '../auth/shared/AuthStepIndicator';
import {
  CREATE_NOTEBOOK_STEP_CONTENT,
  CREATE_NOTEBOOK_STEP_COUNT,
  CREATE_NOTEBOOK_STEP_LABELS,
  CREATE_NOTEBOOK_STEPS,
} from '../create-notebook/constants';
import AccessStep from '../create-notebook/steps/AccessStep';
import DetailsStep from '../create-notebook/steps/DetailsStep';
import ThumbnailStep from '../create-notebook/steps/ThumbnailStep';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/Dialog';
import { useEditNotebookForm } from './hooks/useEditNotebookForm';
import '../auth/shared/auth.css';
import '../create-notebook/create-notebook.css';

function NotebookEditForm({ notebook, onSuccess, onCancel }) {
  const {
    currentStep,
    formData,
    updateField,
    updateThumbnail,
    isSubmitting,
    error,
    handleDetailsContinue,
    handleAccessContinue,
    handleThumbnailContinue,
    handleBack,
  } = useEditNotebookForm({ notebook, onSuccess, onCancel });

  const { title, description } = CREATE_NOTEBOOK_STEP_CONTENT[currentStep];

  const renderStep = () => {
    switch (currentStep) {
      case CREATE_NOTEBOOK_STEPS.DETAILS:
        return (
          <DetailsStep
            formData={formData}
            updateField={updateField}
            onBack={handleBack}
            backLabel="Cancel"
            onContinue={handleDetailsContinue}
            error={error}
          />
        );
      case CREATE_NOTEBOOK_STEPS.ACCESS:
        return (
          <AccessStep
            formData={formData}
            updateField={updateField}
            onBack={handleBack}
            onContinue={handleAccessContinue}
            error={error}
          />
        );
      case CREATE_NOTEBOOK_STEPS.THUMBNAIL:
        return (
          <ThumbnailStep
            formData={formData}
            updateThumbnail={updateThumbnail}
            onBack={handleBack}
            onContinue={handleThumbnailContinue}
            isSubmitting={isSubmitting}
            continueLabel="Save changes"
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className="notebook-edit-dialog__header">
        <DialogTitle className="notebook-edit-dialog__title">{title}</DialogTitle>
        <DialogDescription className="notebook-edit-dialog__description">
          {description}
        </DialogDescription>
      </header>

      <AuthStepIndicator
        currentStep={currentStep}
        stepCount={CREATE_NOTEBOOK_STEP_COUNT}
        stepLabels={CREATE_NOTEBOOK_STEP_LABELS}
      />

      <div className="notebook-edit-dialog__body">{renderStep()}</div>
    </>
  );
}

export default function NotebookEditDialog({ notebook, open, onOpenChange, onUpdated }) {
  const handleSuccess = (updatedNotebook) => {
    onUpdated?.(updatedNotebook);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="notebook-edit-dialog">
        {open ? (
          <NotebookEditForm
            key={notebook.id}
            notebook={notebook}
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
