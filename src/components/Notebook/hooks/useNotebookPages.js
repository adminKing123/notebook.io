import { useCallback, useEffect, useRef, useState } from 'react';
import { createPageId, normalizePages } from '../utils/normalizePages';
import { useNotebookPageTransition } from './useNotebookPageTransition';

export function useNotebookPages(initialPages) {
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

  const removePage = useCallback(
    ({ revokePageImages, onClearSelectedImage }) => {
      if (totalPages <= 1 || isAnimatingRef.current) return;

      const deletedIndex = currentPageIndex;
      const deletedPage = pages[deletedIndex];
      const isLastPage = deletedIndex === totalPages - 1;
      const targetIndex = isLastPage ? deletedIndex - 1 : deletedIndex + 1;
      const nextCurrentIndex = targetIndex > deletedIndex ? targetIndex - 1 : targetIndex;

      transitionToPage(targetIndex, deletedIndex, {
        onComplete: () => {
          revokePageImages(deletedPage);
          setPages((previousPages) =>
            previousPages.filter((_, index) => index !== deletedIndex),
          );
          setCurrentPageIndex(nextCurrentIndex);
          onClearSelectedImage();
        },
      });
    },
    [currentPageIndex, isAnimatingRef, pages, totalPages, transitionToPage],
  );

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

  return {
    pages,
    setPages,
    currentPageIndex,
    currentPage,
    totalPages,
    viewportRef,
    pageRefs,
    isAnimatingRef,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    addPage,
    removePage,
  };
}
