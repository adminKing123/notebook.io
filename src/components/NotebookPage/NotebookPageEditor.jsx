import { CONTENT_LINE_COUNT, HEADER_LINE_COUNT, TOTAL_LINES } from './constants';

export default function NotebookPageEditor({
  textareaRef,
  defaultValue,
  measureRef,
  onInput,
  onKeyDown,
  onPaste,
  onFocus,
}) {
  return (
    <div className="notebook-page__editor">
      <div className="notebook-page__editor-guides" aria-hidden="true">
        {Array.from({ length: HEADER_LINE_COUNT }, (_, index) => (
          <div
            key={`header-${index}`}
            ref={index === 0 ? measureRef : undefined}
            className={
              index === 0
                ? 'notebook-page__guide-row notebook-page__guide-row--title'
                : 'notebook-page__guide-row notebook-page__guide-row--subtitle'
            }
          />
        ))}
        {Array.from({ length: CONTENT_LINE_COUNT }, (_, index) => (
          <div key={`content-${index}`} className="notebook-page__guide-row" />
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="notebook-page__textarea"
        defaultValue={defaultValue}
        rows={TOTAL_LINES}
        spellCheck={false}
        aria-label="Notebook page content"
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
      />
    </div>
  );
}
