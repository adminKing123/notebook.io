import { useCallback, useEffect, useState } from 'react';
import NotebookConfigPanel from './config/NotebookConfigPanel';
import { useNotebookPages } from './hooks/useNotebookPages';
import { useNotebookZoom } from './hooks/useNotebookZoom';
import NotebookPagesViewport from './NotebookPagesViewport';
import NotebookZoomShell from './NotebookZoomShell';
import './Notebook.css';

export default function Notebook({
  pages: controlledPages,
  setPages: setControlledPages,
  totalPages: controlledTotalPages,
  isWindowLoading = false,
  isSaving = false,
  onPageIndexChange,
  onContentChange,
  onImportImage,
  onImportExistingImages,
  onUpdateImage,
  onDeleteImage,
  onAddPageRequest,
  onRemovePageRequest,
  initialPages = [{}],
}) {
  const isControlled = controlledPages !== undefined;

  const {
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
    removePage: removePageBase,
  } = useNotebookPages(isControlled ? controlledPages : initialPages, {
    controlledPages: isControlled ? controlledPages : undefined,
    setControlledPages: isControlled ? setControlledPages : undefined,
    totalPages: isControlled ? controlledTotalPages : undefined,
    onPageIndexChange,
    onAddPageRequest,
    onRemovePageRequest,
  });

  const {
    zoom,
    zoomContentRef,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
    shellHeight,
  } = useNotebookZoom();

  const [selectedImageId, setSelectedImageId] = useState(null);

  const importImage = useCallback(
    async (file) => {
      if (isAnimatingRef.current || !file?.type.startsWith('image/')) {
        return;
      }

      if (onImportImage) {
        const imageId = await onImportImage(currentPageIndex, file);
        if (imageId) {
          setSelectedImageId(imageId);
        }
        return;
      }
    },
    [currentPageIndex, isAnimatingRef, onImportImage],
  );

  const importExistingImages = useCallback(
    async (images) => {
      if (isAnimatingRef.current || !images?.length) {
        return;
      }

      if (onImportExistingImages) {
        const imageId = await onImportExistingImages(currentPageIndex, images);
        if (imageId) {
          setSelectedImageId(imageId);
        }
      }
    },
    [currentPageIndex, isAnimatingRef, onImportExistingImages],
  );

  const updatePageImage = useCallback(
    (imageId, patch) => {
      onUpdateImage?.(currentPageIndex, imageId, patch);
    },
    [currentPageIndex, onUpdateImage],
  );

  const deleteImage = useCallback(
    (imageId) => {
      const idToDelete = imageId ?? selectedImageId;
      if (!idToDelete) {
        return;
      }

      onDeleteImage?.(currentPageIndex, idToDelete);
      setSelectedImageId(null);
    },
    [currentPageIndex, onDeleteImage, selectedImageId],
  );

  const removePage = useCallback(() => {
    removePageBase({
      revokePageImages: () => {},
      onClearSelectedImage: () => setSelectedImageId(null),
    });
  }, [removePageBase]);

  const currentPageImages = pages[currentPageIndex]?.images ?? [];

  useEffect(() => {
    const hasSelectedImage = currentPageImages.some((image) => image.id === selectedImageId);
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
        deleteImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteImage, selectedImageId]);

  return (
    <div className="notebook">
      {(isWindowLoading || isSaving) && (
        <div className="notebook__status-bar" aria-live="polite">
          {isWindowLoading && <span className="notebook__status-label">Loading pages</span>}
          {isSaving && <span className="notebook__status-label">Saving</span>}
        </div>
      )}

      <NotebookZoomShell
        zoom={zoom}
        zoomContentRef={zoomContentRef}
        shellHeight={shellHeight}
      >
        <NotebookPagesViewport
          pages={pages}
          currentPageIndex={currentPageIndex}
          pageRefs={pageRefs}
          viewportRef={viewportRef}
          selectedImageId={selectedImageId}
          onSelectImage={setSelectedImageId}
          onUpdateImage={updatePageImage}
          onDeleteImage={deleteImage}
          onImportImage={importImage}
          onContentChange={onContentChange}
        />
      </NotebookZoomShell>

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
        onImportExistingImages={importExistingImages}
        canRemovePage={totalPages > 1}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />
    </div>
  );
}
