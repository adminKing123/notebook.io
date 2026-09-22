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
    <>
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
    </>
  );
}
