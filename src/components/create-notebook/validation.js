export function validateNotebookDetails(formData) {
  if (!formData.title.trim()) {
    return 'Notebook title is required.';
  }

  return '';
}
