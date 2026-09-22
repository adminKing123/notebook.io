import { useCallback, useEffect, useRef, useState } from 'react';
import NotebookPage from '../NotebookPage';
import NotebookConfigPanel from './NotebookConfigPanel';
import { useNotebookPageTransition } from './hooks/useNotebookPageTransition';
import { createPageId, normalizePages } from './utils/normalizePages';
import './Notebook.css';

/**
 * @typedef {object} NotebookPageData
 * @property {string} [id]
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string|string[]} [content]
 */

/**
 * @param {object} props
 * @param {NotebookPageData[]} [props.pages=[{}]] - Collection of notebook pages
 */
export default function Notebook({ pages: initialPages = [{}] }) {
  const [pages, setPages] = useState(() => normalizePages(initialPages));
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pendingPageIndex, setPendingPageIndex] = useState(null);

  const viewportRef = useRef(null);
  const pageRefs = useRef([]);

  const totalPages = pages.length;
  const currentPage = currentPageIndex + 1;

  const { transitionToPage, isAnimatingRef } = useNotebookPageTransition({
    pageRefs,
    viewportRef,
    onPageChange: setCurrentPageIndex,
  });

  const navigateToIndex = useCallback(
    (targetIndex) => {
      const clampedIndex = Math.min(Math.max(0, targetIndex), totalPages - 1);
      transitionToPage(clampedIndex, currentPageIndex);
    },
    [currentPageIndex, totalPages, transitionToPage],
  );

  const goToPage = useCallback(
    (pageNumber) => {
      navigateToIndex(pageNumber - 1);
    },
    [navigateToIndex],
  );

  const goToPreviousPage = useCallback(() => {
    navigateToIndex(currentPageIndex - 1);
  }, [currentPageIndex, navigateToIndex]);

  const goToNextPage = useCallback(() => {
    navigateToIndex(currentPageIndex + 1);
  }, [currentPageIndex, navigateToIndex]);

  const addPage = useCallback(() => {
    if (isAnimatingRef.current) return;

    setPendingPageIndex(totalPages);
    setPages((previousPages) => [...previousPages, { id: createPageId() }]);
  }, [isAnimatingRef, totalPages]);

  const removePage = useCallback(() => {
    if (totalPages <= 1 || isAnimatingRef.current) return;

    const deletedIndex = currentPageIndex;
    const isLastPage = deletedIndex === totalPages - 1;
    const targetIndex = isLastPage ? deletedIndex - 1 : deletedIndex + 1;
    const nextCurrentIndex = targetIndex > deletedIndex ? targetIndex - 1 : targetIndex;

    transitionToPage(targetIndex, deletedIndex, {
      onComplete: () => {
        setPages((previousPages) =>
          previousPages.filter((_, index) => index !== deletedIndex),
        );
        setCurrentPageIndex(nextCurrentIndex);
      },
    });
  }, [currentPageIndex, isAnimatingRef, totalPages, transitionToPage]);

  useEffect(() => {
    if (pendingPageIndex === null) return;

    transitionToPage(pendingPageIndex, currentPageIndex);
    setPendingPageIndex(null);
  }, [pendingPageIndex, pages.length, currentPageIndex, transitionToPage]);

  useEffect(() => {
    if (isAnimatingRef.current) return;

    pageRefs.current.forEach((pageElement, index) => {
      if (!pageElement) return;

      pageElement.style.display = index === currentPageIndex ? 'block' : 'none';
      pageElement.style.transform = '';
    });
  }, [currentPageIndex, isAnimatingRef, pages.length]);

  return (
    <div className="notebook">
      <div className="notebook__pages-viewport" ref={viewportRef}>
        {pages.map((page, index) => (
          <div
            key={page.id}
            ref={(element) => {
              pageRefs.current[index] = element;
            }}
            className="notebook__page"
          >
            <NotebookPage
              title={page.title}
              subtitle={page.subtitle}
              content={page.content}
              autoFocusContent={index === 0 && currentPageIndex === 0}
            />
          </div>
        ))}
      </div>

      <NotebookConfigPanel
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onAddPage={addPage}
        onRemovePage={removePage}
        canRemovePage={totalPages > 1}
      />
    </div>
  );
}
