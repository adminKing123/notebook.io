import { LINE_CHAR_ALLOWED, TOTAL_LINES } from '../constants';
import {
  getLineInfoAtPosition,
  getLineStartPosition,
  linesToPageText,
  splitPageText,
} from './pageTextUtils';

export function handleTextareaKeyDown(event, textarea) {
  const { selectionStart, selectionEnd, value } = textarea;

  if (event.key === 'Enter') {
    const lineIndex = getLineInfoAtPosition(value, selectionStart).lineIndex;
    if (lineIndex >= TOTAL_LINES - 1) {
      event.preventDefault();
    }
    return;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  if (selectionStart !== selectionEnd) {
    return;
  }

  const lineInfo = getLineInfoAtPosition(value, selectionStart);
  const isAtEndOfFullLine =
    lineInfo.lineText.length === LINE_CHAR_ALLOWED &&
    lineInfo.offsetInLine === LINE_CHAR_ALLOWED;

  if (!isAtEndOfFullLine) {
    return;
  }

  event.preventDefault();

  if (lineInfo.lineIndex >= TOTAL_LINES - 1) {
    return;
  }

  const lines = splitPageText(value);
  const nextLineIndex = lineInfo.lineIndex + 1;
  const nextLine = lines[nextLineIndex] ?? '';

  lines[nextLineIndex] = (event.key + nextLine).slice(0, LINE_CHAR_ALLOWED);

  const nextText = linesToPageText(lines);
  textarea.value = nextText;

  const cursorPosition = getLineStartPosition(nextText, nextLineIndex) + 1;
  textarea.setSelectionRange(cursorPosition, cursorPosition);
}

export function handleTextareaPaste(event, textarea) {
  event.preventDefault();

  const pastedText = (event.clipboardData || window.clipboardData).getData('text');
  const { selectionStart, selectionEnd, value } = textarea;
  const nextValue = value.slice(0, selectionStart) + pastedText + value.slice(selectionEnd);
  const normalizedText = linesToPageText(splitPageText(nextValue));

  textarea.value = normalizedText;

  const cursorPosition = Math.min(selectionStart + pastedText.length, normalizedText.length);
  textarea.setSelectionRange(cursorPosition, cursorPosition);
}
