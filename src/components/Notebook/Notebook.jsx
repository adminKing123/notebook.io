import { useCallback, useEffect, useRef, useState } from 'react';
import NotebookPage from '../NotebookPage';
import { createDefaultImageLayout } from '../NotebookPage/utils/imageLayout';
import {
  loadImageFromFile,
  revokeImageSrc,
} from '../NotebookPage/utils/loadImageFromFile';
import NotebookConfigPanel from './NotebookConfigPanel';
import { useNotebookPageTransition } from './hooks/useNotebookPageTransition';
import { createPageId, normalizePages } from './utils/normalizePages';
import './Notebook.css';

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1;
const ZOOM_STEP = 0.1;
const DEFAULT_ZOOM = 1;

/**
 * @typedef {object} NotebookPageImage
 * @property {string} id
 * @property {string} src
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} aspectRatio
 */

/**
 * @typedef {object} NotebookPageData
 * @property {string} [id]
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string|string[]} [content]
 * @property {NotebookPageImage[]} [images]
 */

/**
 * @param {object} props
 * @param {NotebookPageData[]} [props.pages=[{}]] - Collection of notebook pages
 */
export default function Notebook({ pages: initialPages = [{}] }) {
  const [pages, setPages] = useState(() => normalizePages(initialPages));
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pendingPageIndex, setPendingPageIndex] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const viewportRef = useRef(null);
  const pageRefs = useRef([]);

  const totalPages = pages.length;
  const currentPage = currentPageIndex + 1;
  const currentPageImages = pages[currentPageIndex]?.images ?? [];

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

  const zoomIn = useCallback(() => {
    setZoom((previousZoom) =>
      Math.min(ZOOM_MAX, Number((previousZoom + ZOOM_STEP).toFixed(2))),
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((previousZoom) =>
      Math.max(ZOOM_MIN, Number((previousZoom - ZOOM_STEP).toFixed(2))),
    );
  }, []);

  const addPage = useCallback(() => {
    if (isAnimatingRef.current) return;

    setPendingPageIndex(totalPages);
    setPages((previousPages) => [...previousPages, { id: createPageId() }]);
  }, [isAnimatingRef, totalPages]);

  const revokePageImages = useCallback((page) => {
    page.images?.forEach((image) => revokeImageSrc(image.src));
  }, []);

  const removePage = useCallback(() => {
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
        setSelectedImageId(null);
      },
    });
  }, [
    currentPageIndex,
    isAnimatingRef,
    pages,
    revokePageImages,
    totalPages,
    transitionToPage,
  ]);

  const importImage = useCallback(
    async (file) => {
      if (isAnimatingRef.current || !file?.type.startsWith('image/')) {
        return;
      }

      try {
        const { src, aspectRatio } = await loadImageFromFile(file);
        const layout = createDefaultImageLayout(aspectRatio);
        const id = createPageId();

        setPages((previousPages) =>
          previousPages.map((page, index) =>
            index === currentPageIndex
              ? {
                  ...page,
                  images: [...page.images, { id, src, ...layout }],
                }
              : page,
          ),
        );
        setSelectedImageId(id);
      } catch {
        // Ignore invalid image files.
      }
    },
    [currentPageIndex, isAnimatingRef],
  );

  const updatePageImage = useCallback(
    (imageId, patch) => {
      setPages((previousPages) =>
        previousPages.map((page, index) => {
          if (index !== currentPageIndex) {
            return page;
          }

          return {
            ...page,
            images: page.images.map((image) =>
              image.id === imageId ? { ...image, ...patch } : image,
            ),
          };
        }),
      );
    },
    [currentPageIndex],
  );

  const deleteSelectedImage = useCallback(() => {
    if (!selectedImageId) {
      return;
    }

    setPages((previousPages) =>
      previousPages.map((page, index) => {
        if (index !== currentPageIndex) {
          return page;
        }

        const removedImage = page.images.find((image) => image.id === selectedImageId);
        if (removedImage) {
          revokeImageSrc(removedImage.src);
        }

        return {
          ...page,
          images: page.images.filter((image) => image.id !== selectedImageId),
        };
      }),
    );
    setSelectedImageId(null);
  }, [currentPageIndex, selectedImageId]);

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

  useEffect(() => {
    const hasSelectedImage = currentPageImages.some(
      (image) => image.id === selectedImageId,
    );

    if (!hasSelectedImage) {
      setSelectedImageId(null);
    }
  }, [currentPageImages, selectedImageId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        selectedImageId &&
        !(event.target instanceof HTMLInputElement)
      ) {
        event.preventDefault();
        deleteSelectedImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteSelectedImage, selectedImageId]);

  return (
    <div className="notebook">
      <div className="notebook__zoom-shell">
        <div
          className="notebook__zoom-content"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
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
                  images={page.images}
                  selectedImageId={
                    index === currentPageIndex ? selectedImageId : null
                  }
                  onSelectImage={
                    index === currentPageIndex ? setSelectedImageId : undefined
                  }
                  onUpdateImage={
                    index === currentPageIndex ? updatePageImage : undefined
                  }
                  onImportImage={
                    index === currentPageIndex ? importImage : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <NotebookConfigPanel
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        onGoToPage={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onAddPage={addPage}
        onRemovePage={removePage}
        onImportImage={importImage}
        onDeleteSelectedImage={deleteSelectedImage}
        canRemovePage={totalPages > 1}
        canZoomIn={zoom < ZOOM_MAX}
        canZoomOut={zoom > ZOOM_MIN}
        canDeleteSelectedImage={currentPageImages.some(
          (image) => image.id === selectedImageId,
        )}
      />
    </div>
  );
}
