import { useRef } from 'react';
import NotebookPageHeader from './NotebookPageHeader';
import NotebookPageImages from './NotebookPageImages';
import NotebookPageLine from './NotebookPageLine';
import {
  CONTENT_LINE_COUNT,
  CONTENT_LINE_START,
  SUBTITLE_LINE_INDEX,
  TITLE_LINE_INDEX,
} from './constants';
import { useNotebookPageInputs } from './hooks/useNotebookPageInputs';
import { useTypographyScale } from './hooks/useTypographyScale';
import { buildInitialLines } from './utils/buildInitialLines';
import './NotebookPage.css';
import './NotebookPageImages.css';

/**
 * @param {object} props
 * @param {string} [props.title='']
 * @param {string} [props.subtitle] - Defaults to today's date (DD/MM/YYYY DAY_NAME)
 * @param {string|string[]} [props.content=''] - Body text as a string or per-line array
 * @param {boolean} [props.autoFocusContent=true]
 * @param {object[]} [props.images=[]]
 * @param {string|null} [props.selectedImageId]
 * @param {(id: string|null) => void} [props.onSelectImage]
 * @param {(id: string, patch: object) => void} [props.onUpdateImage]
 * @param {(file: File) => void} [props.onImportImage]
 */
export default function NotebookPage({
  title = '',
  subtitle,
  content = '',
  autoFocusContent = true,
  images = [],
  selectedImageId = null,
  onSelectImage,
  onUpdateImage,
  onImportImage,
}) {
  const pageContainerRef = useRef(null);
  const sheetRef = useRef(null);
  const firstPageRowRef = useRef(null);
  const initialPageLinesRef = useRef(
    buildInitialLines({ title, subtitle, content }),
  );

  const typography = useTypographyScale(pageContainerRef, firstPageRowRef);
  const {
    registerPageInput,
    createKeyDownHandler,
    createPasteHandler,
    createFocusHandler,
  } = useNotebookPageInputs({
    autoFocusContent,
    onInputFocus: () => onSelectImage?.(null),
  });

  const initialPageLines = initialPageLinesRef.current;

  return (
    <div className="notebook-page" ref={pageContainerRef}>
      <div
        ref={sheetRef}
        className="notebook-page__sheet"
        style={{
          '--notebook-page-font-size': `${typography.fontSize}px`,
          '--notebook-page-line-height': `${typography.lineHeight}px`,
        }}
        onDragOverCapture={(event) => {
          if (event.dataTransfer.types.includes('Files')) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
          }
        }}
        onDropCapture={(event) => {
          const file = event.dataTransfer.files?.[0];
          if (file?.type.startsWith('image/')) {
            event.preventDefault();
            onImportImage?.(file);
          }
        }}
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
          createFocusHandler={createFocusHandler}
        />

        <div className="notebook-page__lines">
          {Array.from({ length: CONTENT_LINE_COUNT }, (_, offset) => {
            const index = CONTENT_LINE_START + offset;

            return (
              <NotebookPageLine
                key={index}
                index={index}
                defaultValue={initialPageLines[index]}
                inputRef={registerPageInput(index)}
                placeholder={
                  index === CONTENT_LINE_START ? 'Start typing here...' : ''
                }
                onKeyDown={createKeyDownHandler(index)}
                onPaste={createPasteHandler(index)}
                onFocus={createFocusHandler()}
              />
            );
          })}
        </div>

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
    </div>
  );
}
