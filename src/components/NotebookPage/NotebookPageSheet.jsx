import NotebookPageImages from './images/NotebookPageImages';
import NotebookPageContentLines from './NotebookPageContentLines';
import NotebookPageHeader from './NotebookPageHeader';
import {
  SUBTITLE_LINE_INDEX,
  TITLE_LINE_INDEX,
} from './constants';
import {
  handleSheetDragOverCapture,
  handleSheetDropCapture,
} from './utils/imageDropHandlers';

export default function NotebookPageSheet({
  sheetRef,
  typography,
  initialPageLines,
  firstPageRowRef,
  registerPageInput,
  createKeyDownHandler,
  createPasteHandler,
  createInputHandler,
  createFocusHandler,
  images,
  selectedImageId,
  onSelectImage,
  onUpdateImage,
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

      <NotebookPageHeader
        titleValue={initialPageLines[TITLE_LINE_INDEX]}
        subtitleValue={initialPageLines[SUBTITLE_LINE_INDEX]}
        firstPageRowRef={firstPageRowRef}
        registerPageInput={registerPageInput}
        createKeyDownHandler={createKeyDownHandler}
        createPasteHandler={createPasteHandler}
        createInputHandler={createInputHandler}
        createFocusHandler={createFocusHandler}
      />

      <NotebookPageContentLines
        initialPageLines={initialPageLines}
        registerPageInput={registerPageInput}
        createKeyDownHandler={createKeyDownHandler}
        createPasteHandler={createPasteHandler}
        createInputHandler={createInputHandler}
        createFocusHandler={createFocusHandler}
      />

      {onSelectImage && onUpdateImage && (
        <NotebookPageImages
          images={images}
          selectedImageId={selectedImageId}
          onSelectImage={onSelectImage}
          onUpdateImage={onUpdateImage}
          containerRef={sheetRef}
        />
      )}
    </div>
  );
}
