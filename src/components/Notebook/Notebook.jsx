import { useCallback } from 'react';
import NotebookConfigPanel from './config/NotebookConfigPanel';
import { useNotebookPageImages } from './hooks/useNotebookPageImages';
import { useNotebookPages } from './hooks/useNotebookPages';
import { useNotebookZoom } from './hooks/useNotebookZoom';
import NotebookPagesViewport from './NotebookPagesViewport';
import NotebookZoomShell from './NotebookZoomShell';
import './Notebook.css';

/**
 * @param {object} props
 * @param {import('./types.js').NotebookPageData[]} [props.pages=[{}]]
 */
export default function Notebook({ pages: initialPages = [{}] }) {
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
  } = useNotebookPages(initialPages);

  const {
    selectedImageId,
    setSelectedImageId,
    importImage,
    updatePageImage,
    deleteSelectedImage,
    revokePageImages,
    canDeleteSelectedImage,
  } = useNotebookPageImages({
    pages,
    setPages,
    currentPageIndex,
    isAnimatingRef,
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

  const removePage = useCallback(() => {
    removePageBase({
      revokePageImages,
      onClearSelectedImage: () => setSelectedImageId(null),
    });
  }, [removePageBase, revokePageImages, setSelectedImageId]);

  return (
    <div className="notebook">
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
          onImportImage={importImage}
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
        onDeleteSelectedImage={deleteSelectedImage}
        canRemovePage={totalPages > 1}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        canDeleteSelectedImage={canDeleteSelectedImage}
      />
    </div>
  );
}
