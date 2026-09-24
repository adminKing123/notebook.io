import NotebookPageImages from './images/NotebookPageImages';
import {
  handleSheetDragOverCapture,
  handleSheetDropCapture,
} from './utils/imageDropHandlers';

export default function NotebookPageSheet({
  sheetRef,
  typography,
  editor,
  images,
  selectedImageId,
  onSelectImage,
  onUpdateImage,
  onDeleteImage,
  onImportImage,
}) {
  return (
    <div
      ref={sheetRef}
      className="notebook-page__sheet"
      style={{
        '--notebook-page-font-size': `${typography.fontSize}px`,
        '--notebook-page-line-height': `${typography.lineHeight}px`,
      }}
      onDragOverCapture={handleSheetDragOverCapture}
      onDropCapture={(event) => handleSheetDropCapture(event, onImportImage)}
    >
      <div className="notebook-page__margin-line-1" aria-hidden="true" />
      <div className="notebook-page__margin-line-2" aria-hidden="true" />

      {editor}

      {onSelectImage && onUpdateImage && (
        <NotebookPageImages
          images={images}
          selectedImageId={selectedImageId}
          onSelectImage={onSelectImage}
          onUpdateImage={onUpdateImage}
          onDeleteImage={onDeleteImage}
          containerRef={sheetRef}
        />
      )}
    </div>
  );
}
