import NotebookPageLine from './NotebookPageLine';
import { SUBTITLE_LINE_INDEX, TITLE_LINE_INDEX } from './constants';

export default function NotebookPageHeader({
  titleValue,
  subtitleValue,
  firstPageRowRef,
  registerPageInput,
  createKeyDownHandler,
  createPasteHandler,
}) {
  return (
    <header className="notebook-page__header">
      <NotebookPageLine
        index={TITLE_LINE_INDEX}
        variant="title"
        placeholder="Title"
        defaultValue={titleValue}
        inputRef={registerPageInput(TITLE_LINE_INDEX)}
        rowRef={firstPageRowRef}
        onKeyDown={createKeyDownHandler(TITLE_LINE_INDEX)}
        onPaste={createPasteHandler(TITLE_LINE_INDEX)}
      />

      <NotebookPageLine
        index={SUBTITLE_LINE_INDEX}
        variant="subtitle"
        defaultValue={subtitleValue}
        inputRef={registerPageInput(SUBTITLE_LINE_INDEX)}
        onKeyDown={createKeyDownHandler(SUBTITLE_LINE_INDEX)}
        onPaste={createPasteHandler(SUBTITLE_LINE_INDEX)}
      />

      <div className="notebook-page__header-divider" aria-hidden="true" />
    </header>
  );
}
