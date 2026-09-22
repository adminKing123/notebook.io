import { useCallback, useState } from 'react';

export function useStepForm({ initialForm, stepCount, initialStep = 0 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState(initialForm);

  const updateField = useCallback((field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }, []);

  const goNext = useCallback(() => {
    setCurrentStep((previous) => Math.min(previous + 1, stepCount - 1));
  }, [stepCount]);

  const goBack = useCallback(() => {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }, []);

  return {
    currentStep,
    formData,
    updateField,
    goNext,
    goBack,
    isFirstStep: currentStep === initialStep,
  };
}
