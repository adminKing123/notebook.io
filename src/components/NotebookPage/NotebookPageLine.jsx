import { LINE_CHAR_ALLOWED } from './constants';

export default function NotebookPageLine({
  index,
  inputRef,
  rowRef,
  onKeyDown,
  onPaste,
  onFocus,
  variant = 'default',
  placeholder = '',
  defaultValue = '',
}) {
  return (
    <div className={`notebook-page__row notebook-page__row--${variant}`} ref={rowRef}>
      <input
        ref={inputRef}
        type="text"
        className="notebook-page__input"
        maxLength={LINE_CHAR_ALLOWED}
        data-index={index}
        placeholder={placeholder}
        defaultValue={defaultValue}
        spellCheck={false}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
      />
    </div>
  );
}
