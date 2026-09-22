import ConfigDivider from './ConfigDivider';
import NotebookImageControls from './NotebookImageControls';
import NotebookPageActionControls from './NotebookPageActionControls';
import NotebookPageNavControls from './NotebookPageNavControls';
import NotebookZoomControls from './NotebookZoomControls';

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
  onDeleteSelectedImage,
  canRemovePage,
  canZoomIn,
  canZoomOut,
  canDeleteSelectedImage,
}) {
  return (
    <div className="notebook__config-panel">
      <NotebookPageNavControls
        currentPage={currentPage}
        totalPages={totalPages}
        onGoToPage={onGoToPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />

      <ConfigDivider />

      <NotebookZoomControls
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />

      <ConfigDivider />

      <NotebookImageControls
        onImportImage={onImportImage}
        onDeleteSelectedImage={onDeleteSelectedImage}
        canDeleteSelectedImage={canDeleteSelectedImage}
      />

      <ConfigDivider />

      <NotebookPageActionControls
        onAddPage={onAddPage}
        onRemovePage={onRemovePage}
        canRemovePage={canRemovePage}
      />
    </div>
  );
}
