import { useCallback } from 'react';
import { updateNotebook } from '../../../api/notebooks';
import { useAuthFormMessages } from '../../auth/shared/hooks/useAuthFormMessages';
import { useStepForm } from '../../auth/shared/hooks/useStepForm';
import {
  CREATE_NOTEBOOK_STEP_COUNT,
  CREATE_NOTEBOOK_STEPS,
  INITIAL_CREATE_NOTEBOOK_FORM,
} from '../../create-notebook/constants';
import { validateNotebookDetails } from '../../create-notebook/validation';
import { NOTEBOOK_ACCESS } from '../constants';

function notebookToInitialForm(notebook) {
  return {
    ...INITIAL_CREATE_NOTEBOOK_FORM,
    title: notebook.title ?? '',
    description: notebook.description ?? '',
    access: notebook.access ?? NOTEBOOK_ACCESS.PRIVATE,
    thumbnailPreview: notebook.thumbnailUrl ?? '',
    clearThumbnail: false,
  };
}

export function useEditNotebookForm({ notebook, onSuccess, onCancel }) {
  const stepForm = useStepForm({
    initialForm: notebookToInitialForm(notebook),
    stepCount: CREATE_NOTEBOOK_STEP_COUNT,
    initialStep: CREATE_NOTEBOOK_STEPS.DETAILS,
  });
  const { isSubmitting, setIsSubmitting, error, setError, clearMessages } = useAuthFormMessages();

  const updateThumbnail = useCallback(
    (file) => {
      const previousPreview = stepForm.formData.thumbnailPreview;

      if (previousPreview.startsWith('blob:')) {
        URL.revokeObjectURL(previousPreview);
      }

      if (file) {
        stepForm.updateField('thumbnailFile', file);
        stepForm.updateField('thumbnailPreview', URL.createObjectURL(file));
        stepForm.updateField('clearThumbnail', false);
        return;
      }

      if (stepForm.formData.thumbnailFile) {
        stepForm.updateField('thumbnailFile', null);
        stepForm.updateField('thumbnailPreview', notebook.thumbnailUrl ?? '');
        stepForm.updateField('clearThumbnail', false);
        return;
      }

      stepForm.updateField('thumbnailFile', null);
      stepForm.updateField('thumbnailPreview', '');
      stepForm.updateField('clearThumbnail', Boolean(notebook.thumbnailUrl));
    },
    [notebook.thumbnailUrl, stepForm],
  );

  const handleDetailsContinue = useCallback(() => {
    clearMessages();
    const validationError = validateNotebookDetails(stepForm.formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    stepForm.goNext();
  }, [clearMessages, setError, stepForm]);

  const handleAccessContinue = useCallback(() => {
    clearMessages();
    stepForm.goNext();
  }, [clearMessages, stepForm]);

  const handleThumbnailContinue = useCallback(async () => {
    clearMessages();
    setIsSubmitting(true);

    try {
      const updatedNotebook = await updateNotebook(notebook.id, {
        title: stepForm.formData.title,
        description: stepForm.formData.description,
        access: stepForm.formData.access,
        thumbnailFile: stepForm.formData.thumbnailFile,
        clearThumbnail: stepForm.formData.clearThumbnail,
      });
      onSuccess?.(updatedNotebook);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [clearMessages, notebook.id, onSuccess, setError, setIsSubmitting, stepForm.formData]);

  const handleBack = useCallback(() => {
    clearMessages();

    if (stepForm.isFirstStep) {
      onCancel?.();
      return;
    }

    stepForm.goBack();
  }, [clearMessages, onCancel, stepForm]);

  return {
    currentStep: stepForm.currentStep,
    formData: stepForm.formData,
    updateField: stepForm.updateField,
    updateThumbnail,
    isSubmitting,
    error,
    handleDetailsContinue,
    handleAccessContinue,
    handleThumbnailContinue,
    handleBack,
  };
}
