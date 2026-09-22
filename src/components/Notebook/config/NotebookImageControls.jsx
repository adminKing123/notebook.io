import { useRef } from 'react';
import { MdHighlightOff, MdImage } from 'react-icons/md';

export default function NotebookImageControls({
  onImportImage,
  onDeleteSelectedImage,
  canDeleteSelectedImage,
}) {
  const imageInputRef = useRef(null);

  const handleImageInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportImage(file);
    }
    event.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        className="notebook__config-button"
        title="Import image"
        onClick={() => imageInputRef.current?.click()}
      >
        <MdImage />
      </button>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="notebook__config-file-input"
        onChange={handleImageInputChange}
      />

      <button
        type="button"
        className="notebook__config-button notebook__config-button--danger"
        title="Delete selected image"
        onClick={onDeleteSelectedImage}
        disabled={!canDeleteSelectedImage}
      >
        <MdHighlightOff />
      </button>
    </>
  );
}
