import { useEffect, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function NotebookPageNavControls({
  currentPage,
  totalPages,
  onGoToPage,
  onPreviousPage,
  onNextPage,
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
    <div className="notebook-config__page-field">
      <button
        type="button"
        className="notebook-config__btn"
        title="Previous page"
        aria-label="Previous page"
        onClick={onPreviousPage}
        disabled={currentPage <= 1}
      >
        <MdChevronLeft />
      </button>

      <input
        type="text"
        inputMode="numeric"
        className="notebook-config__page-input"
        title="Page number"
        aria-label="Current page number"
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

      <span className="notebook-config__page-total" aria-hidden="true">
        / {totalPages}
      </span>

      <button
        type="button"
        className="notebook-config__btn"
        title="Next page"
        aria-label="Next page"
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
      >
        <MdChevronRight />
      </button>
    </div>
  );
}
