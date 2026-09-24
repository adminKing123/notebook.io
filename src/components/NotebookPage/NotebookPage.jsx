import { useRef } from 'react';
import NotebookPageEditor from './NotebookPageEditor';
import NotebookPageSheet from './NotebookPageSheet';
import { useNotebookPageTextarea } from './hooks/useNotebookPageTextarea';
import { useTypographyScale } from './hooks/useTypographyScale';
import { buildInitialLines } from './utils/buildInitialLines';
import { linesToPageText } from './utils/pageTextUtils';
import './NotebookPage.css';
import './images/NotebookPageImages.css';

/**
 * @param {object} props
 * @param {string} [props.title='']
 * @param {string} [props.subtitle] - Defaults to today's date (DD/MM/YYYY DAY_NAME)
 * @param {string} [props.content=''] - Body text as newline-separated lines
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
  const measureRef = useRef(null);
  const initialTextRef = useRef(
    linesToPageText(buildInitialLines({ title, subtitle, content })),
  );

  const typography = useTypographyScale(pageContainerRef, measureRef);
  const {
    textareaRef,
    defaultValue,
    handleInput,
    handleKeyDown,
    handlePaste,
    handleFocus,
  } = useNotebookPageTextarea({
    initialText: initialTextRef.current,
    autoFocusContent,
    onInputFocus: () => onSelectImage?.(null),
    onContentChange,
  });

  return (
    <div className="notebook-page" ref={pageContainerRef}>
      <NotebookPageSheet
        sheetRef={sheetRef}
        typography={typography}
        editor={
          <NotebookPageEditor
            textareaRef={textareaRef}
            defaultValue={defaultValue}
            measureRef={measureRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={handleFocus}
          />
        }
        images={images}
        selectedImageId={selectedImageId}
        onSelectImage={onSelectImage}
        onUpdateImage={onUpdateImage}
        onImportImage={onImportImage}
      />
    </div>
  );
}
