import { useEffect, useState } from 'react';
import {
  MdAdd,
  MdChevronLeft,
  MdChevronRight,
  MdDeleteOutline,
} from 'react-icons/md';

export default function NotebookConfigPanel({
  currentPage,
  totalPages,
  onGoToPage,
  onPreviousPage,
  onNextPage,
  onAddPage,
  onRemovePage,
  canRemovePage,
}) {
  const [pageInput, setPageInput] = useState(String(currentPage));

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
