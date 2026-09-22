import { useRef } from 'react';
import NotebookPageHeader from './NotebookPageHeader';
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

/**
 * @param {object} props
 * @param {string} [props.title='']
 * @param {string} [props.subtitle] - Defaults to today's date (DD/MM/YYYY DAY_NAME)
 * @param {string|string[]} [props.content=''] - Body text as a string or per-line array
 * @param {boolean} [props.autoFocusContent=true]
 */
export default function NotebookPage({
  title = '',
  subtitle,
  content = '',
  autoFocusContent = true,
}) {
  const pageContainerRef = useRef(null);
  const firstPageRowRef = useRef(null);
  const initialPageLinesRef = useRef(
    buildInitialLines({ title, subtitle, content }),
  );

  const typography = useTypographyScale(pageContainerRef, firstPageRowRef);
  const { registerPageInput, createKeyDownHandler, createPasteHandler } =
    useNotebookPageInputs({ autoFocusContent });

  const initialPageLines = initialPageLinesRef.current;

  return (
    <div className="notebook-page" ref={pageContainerRef}>
      <div
        className="notebook-page__sheet"
        style={{
          '--notebook-page-font-size': `${typography.fontSize}px`,
          '--notebook-page-line-height': `${typography.lineHeight}px`,
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
