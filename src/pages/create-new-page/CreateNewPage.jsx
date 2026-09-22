import AuthLayout from '../../components/auth/shared/AuthLayout';
import {
  CREATE_NOTEBOOK_STEP_CONTENT,
  CREATE_NOTEBOOK_STEP_COUNT,
  CREATE_NOTEBOOK_STEP_LABELS,
  CREATE_NOTEBOOK_STEPS,
} from '../../components/create-notebook/constants';
import { useCreateNotebookForm } from '../../components/create-notebook/hooks/useCreateNotebookForm';
import AccessStep from '../../components/create-notebook/steps/AccessStep';
import DetailsStep from '../../components/create-notebook/steps/DetailsStep';
import ThumbnailStep from '../../components/create-notebook/steps/ThumbnailStep';
import AppLayout from '../../components/layout/AppLayout';
import '../../components/auth/shared/auth.css';
import '../../components/create-notebook/create-notebook.css';

export default function CreateNewPage() {
  const {
    currentStep,
    formData,
    updateField,
    updateThumbnail,
    error,
    handleDetailsContinue,
    handleAccessContinue,
    handleThumbnailContinue,
    handleBack,
  } = useCreateNotebookForm();

  const { title, description } = CREATE_NOTEBOOK_STEP_CONTENT[currentStep];

  const renderStep = () => {
    switch (currentStep) {
      case CREATE_NOTEBOOK_STEPS.DETAILS:
        return (
          <DetailsStep
            formData={formData}
            updateField={updateField}
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
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <section className="create-notebook-page">
        <AuthLayout
          title={title}
          description={description}
          currentStep={currentStep}
          stepCount={CREATE_NOTEBOOK_STEP_COUNT}
          stepLabels={CREATE_NOTEBOOK_STEP_LABELS}
        >
          {renderStep()}
        </AuthLayout>
      </section>
    </AppLayout>
  );
}
