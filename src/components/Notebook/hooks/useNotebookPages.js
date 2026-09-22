import { useCallback, useEffect, useRef, useState } from 'react';
import { createPageId, normalizePages } from '../utils/normalizePages';
import { useNotebookPageTransition } from './useNotebookPageTransition';

export function useNotebookPages(initialPages, options = {}) {
  const {
    controlledPages,
    setControlledPages,
    totalPages: externalTotalPages,
    onPageIndexChange,
    onAddPageRequest,
    onRemovePageRequest,
  } = options;

  const isControlled = controlledPages !== undefined;
  const [internalPages, setInternalPages] = useState(() => normalizePages(initialPages));
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pendingPageIndex, setPendingPageIndex] = useState(null);

  const pages = isControlled ? controlledPages : internalPages;
  const setPages = isControlled ? setControlledPages : setInternalPages;
  const totalPages = externalTotalPages ?? pages.length;
  const currentPage = currentPageIndex + 1;

  const viewportRef = useRef(null);
  const pageRefs = useRef([]);

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

  const addPage = useCallback(async () => {
    if (isAnimatingRef.current) {
      return;
    }

    if (onAddPageRequest) {
      const createdPageNumber = await onAddPageRequest();
      if (createdPageNumber) {
        setPendingPageIndex(createdPageNumber - 1);
      }
      return;
    }

    setPendingPageIndex(totalPages);
    setPages((previousPages) => [...previousPages, { id: createPageId() }]);
  }, [isAnimatingRef, onAddPageRequest, setPages, totalPages]);

  const removePage = useCallback(
    async ({ revokePageImages, onClearSelectedImage }) => {
      if (totalPages <= 1 || isAnimatingRef.current) {
        return;
      }

      if (onRemovePageRequest) {
        const nextIndex = await onRemovePageRequest(currentPageIndex);
        if (nextIndex === null || nextIndex === undefined) {
          return;
        }

        setCurrentPageIndex(nextIndex);
        onClearSelectedImage();
        return;
      }

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
    [
      currentPageIndex,
      isAnimatingRef,
      onRemovePageRequest,
      pages,
      setPages,
      totalPages,
      transitionToPage,
    ],
  );

  useEffect(() => {
    if (pendingPageIndex === null) {
      return;
    }

    transitionToPage(pendingPageIndex, currentPageIndex);
    setPendingPageIndex(null);
  }, [pendingPageIndex, pages.length, currentPageIndex, transitionToPage]);

  useEffect(() => {
    if (isAnimatingRef.current) {
      return;
    }

    pageRefs.current.forEach((pageElement, index) => {
      if (!pageElement) {
        return;
      }

      pageElement.style.display = index === currentPageIndex ? 'block' : 'none';
      pageElement.style.transform = '';
    });
  }, [currentPageIndex, isAnimatingRef, pages.length]);

  useEffect(() => {
    onPageIndexChange?.(currentPageIndex);
  }, [currentPageIndex, onPageIndexChange]);

  useEffect(() => {
    if (currentPageIndex > totalPages - 1) {
      setCurrentPageIndex(Math.max(totalPages - 1, 0));
    }
  }, [currentPageIndex, totalPages]);

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
