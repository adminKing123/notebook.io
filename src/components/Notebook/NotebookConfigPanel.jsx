import { useEffect, useRef, useState } from 'react';
import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdDeleteOutline,
  MdHighlightOff,
  MdImage,
} from 'react-icons/md';

export default function NotebookConfigPanel({
  currentPage,
  totalPages,
  onGoToPage,
  onPreviousPage,
  onNextPage,
  onAddPage,
  onRemovePage,
  onImportImage,
  onDeleteSelectedImage,
  canRemovePage,
  canDeleteSelectedImage,
}) {
  const [pageInput, setPageInput] = useState(String(currentPage));
  const imageInputRef = useRef(null);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const commitPageInput = () => {
    const pageNumber = parseInt(pageInput, 10);

    if (Number.isNaN(pageNumber)) {
      setPageInput(String(currentPage));
      return;
    }

    onGoToPage(pageNumber);
  };

  const handleImageInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportImage(file);
    }
    event.target.value = '';
  };

  return (
    <div className="notebook__config-panel">
      <button
        type="button"
        className="notebook__config-button"
        title="Previous page"
        onClick={onPreviousPage}
        disabled={currentPage <= 1}
      >
        <MdChevronLeft />
      </button>

      <input
        type="text"
        inputMode="numeric"
        className="notebook__config-page-input"
        title="Page number"
        value={pageInput}
        onChange={(event) => setPageInput(event.target.value)}
        onBlur={commitPageInput}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitPageInput();
          }
        }}
      />

      <button
        type="button"
        className="notebook__config-button"
        title="Next page"
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
      >
        <MdChevronRight />
      </button>

      <span className="notebook__config-divider" aria-hidden="true" />

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

      <span className="notebook__config-divider" aria-hidden="true" />

      <button
        type="button"
        className="notebook__config-button"
        title="Add new page"
        onClick={onAddPage}
      >
        <MdAdd />
      </button>

      <button
        type="button"
        className="notebook__config-button notebook__config-button--danger"
        title="Remove this page"
        onClick={onRemovePage}
        disabled={!canRemovePage}
      >
        <MdDeleteOutline />
      </button>
    </div>
  );
}
