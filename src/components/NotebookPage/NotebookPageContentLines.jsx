import NotebookPageLine from './NotebookPageLine';
import { CONTENT_LINE_COUNT, CONTENT_LINE_START } from './constants';

export default function NotebookPageContentLines({
  initialPageLines,
  registerPageInput,
  createKeyDownHandler,
  createPasteHandler,
  createFocusHandler,
}) {
  return (
    <div className="notebook-page__lines">
      {Array.from({ length: CONTENT_LINE_COUNT }, (_, offset) => {
        const index = CONTENT_LINE_START + offset;

        return (
          <NotebookPageLine
            key={index}
            index={index}
            defaultValue={initialPageLines[index]}
            inputRef={registerPageInput(index)}
            onKeyDown={createKeyDownHandler(index)}
            onPaste={createPasteHandler(index)}
            onFocus={createFocusHandler()}
          />
        );
      })}
    </div>
  );
}
