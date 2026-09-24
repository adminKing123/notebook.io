import { useRef, useState } from 'react';
import { MAX_PAGE_IMAGE_IMPORT } from '../../../../pages/notebook/constants';

export function useNotebookImageImport(onImportImage) {
  const imageInputRef = useRef(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleImageInputChange = (event) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_PAGE_IMAGE_IMPORT);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        onImportImage(file);
      }
    });

    event.target.value = '';
  };

  return {
    imageInputRef,
    isPickerOpen,
    setIsPickerOpen,
    handleImageInputChange,
    openFilePicker: () => imageInputRef.current?.click(),
    maxSelection: MAX_PAGE_IMAGE_IMPORT,
  };
}
