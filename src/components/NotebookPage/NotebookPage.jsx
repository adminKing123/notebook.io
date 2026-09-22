import { useRef } from 'react';
import NotebookPageSheet from './NotebookPageSheet';
import { useNotebookPageInputs } from './hooks/useNotebookPageInputs';
import { useTypographyScale } from './hooks/useTypographyScale';
import { buildInitialLines } from './utils/buildInitialLines';
import './NotebookPage.css';
import './images/NotebookPageImages.css';

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
 * @param {(content: object) => void} [props.onContentChange]
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
  onContentChange,
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
    createInputHandler,
    createFocusHandler,
  } = useNotebookPageInputs({
    autoFocusContent,
    onInputFocus: () => onSelectImage?.(null),
    onContentChange,
  });

  const initialPageLines = initialPageLinesRef.current;

  return (
    <div className="notebook-page" ref={pageContainerRef}>
      <NotebookPageSheet
        sheetRef={sheetRef}
        typography={typography}
        initialPageLines={initialPageLines}
        firstPageRowRef={firstPageRowRef}
        registerPageInput={registerPageInput}
        createKeyDownHandler={createKeyDownHandler}
        createPasteHandler={createPasteHandler}
        createInputHandler={createInputHandler}
        createFocusHandler={createFocusHandler}
        images={images}
        selectedImageId={selectedImageId}
        onSelectImage={onSelectImage}
        onUpdateImage={onUpdateImage}
        onImportImage={onImportImage}
      />
    </div>
  );
}
