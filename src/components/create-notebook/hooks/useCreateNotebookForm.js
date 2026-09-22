import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthFormMessages } from '../../auth/shared/hooks/useAuthFormMessages';
import { useStepForm } from '../../auth/shared/hooks/useStepForm';
import { ROUTES } from '../../../routes';
import {
  CREATE_NOTEBOOK_STEP_COUNT,
  CREATE_NOTEBOOK_STEPS,
  INITIAL_CREATE_NOTEBOOK_FORM,
} from '../constants';

function validateDetails(formData) {
  if (!formData.title.trim()) {
    return 'Notebook title is required.';
  }

  return '';
}

function validateAccess(formData) {
  if (!formData.access) {
    return 'Select an access mode for this notebook.';
  }

  return '';
}

export function useCreateNotebookForm() {
  const navigate = useNavigate();
  const stepForm = useStepForm({
    initialForm: INITIAL_CREATE_NOTEBOOK_FORM,
    stepCount: CREATE_NOTEBOOK_STEP_COUNT,
    initialStep: CREATE_NOTEBOOK_STEPS.DETAILS,
  });
  const { error, setError, clearMessages } = useAuthFormMessages();

  const updateThumbnail = useCallback(
    (file) => {
      if (stepForm.formData.thumbnailPreview) {
        URL.revokeObjectURL(stepForm.formData.thumbnailPreview);
      }

      stepForm.updateField('thumbnailFile', file);
      stepForm.updateField('thumbnailPreview', file ? URL.createObjectURL(file) : '');
    },
    [stepForm],
  );

  const handleDetailsContinue = useCallback(() => {
    clearMessages();
    const validationError = validateDetails(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    stepForm.goNext();
  }, [clearMessages, setError, stepForm]);

  const handleAccessContinue = useCallback(() => {
    clearMessages();
    const validationError = validateAccess(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    stepForm.goNext();
  }, [clearMessages, setError, stepForm]);

  const handleThumbnailContinue = useCallback(() => {
    clearMessages();
    navigate(ROUTES.DASHBOARD);
  }, [clearMessages, navigate]);

  const handleBack = useCallback(() => {
    clearMessages();

    if (stepForm.isFirstStep) {
      navigate(ROUTES.DASHBOARD);
      return;
    }

    stepForm.goBack();
  }, [clearMessages, navigate, stepForm]);

  return {
    currentStep: stepForm.currentStep,
    formData: stepForm.formData,
    updateField: stepForm.updateField,
    updateThumbnail,
    isFirstStep: stepForm.isFirstStep,
    error,
    handleDetailsContinue,
    handleAccessContinue,
    handleThumbnailContinue,
    handleBack,
  };
}
