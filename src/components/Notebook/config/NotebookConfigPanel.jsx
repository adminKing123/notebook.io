import NotebookPageNavControls from './NotebookPageNavControls';
import NotebookToolsMenu from './NotebookToolsMenu';
import './config-panel.css';

export default function NotebookConfigPanel({
  currentPage,
  totalPages,
  zoom,
  onGoToPage,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onAddPage,
  onRemovePage,
  onImportImage,
  onImportExistingImages,
  canRemovePage,
  canZoomIn,
  canZoomOut,
}) {
  return (
    <div className="notebook-config" role="toolbar" aria-label="Notebook tools">
      <NotebookPageNavControls
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={onGoToPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />

      <NotebookToolsMenu
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        onAddPage={onAddPage}
        onRemovePage={onRemovePage}
        canRemovePage={canRemovePage}
        onImportImage={onImportImage}
        onImportExistingImages={onImportExistingImages}
      />
    </div>
  );
}
