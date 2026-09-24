import { useCallback, useEffect, useRef } from 'react';
import { CONTENT_LINE_START } from '../constants';
import {
  handleTextareaKeyDown,
  handleTextareaPaste,
} from '../utils/notebookPageTextareaHandlers';
import {
  getLineStartPosition,
  linesToPageText,
  pageTextToContent,
  splitPageText,
} from '../utils/pageTextUtils';

export function useNotebookPageTextarea({
  initialText,
  autoFocusContent = true,
  onInputFocus,
  onContentChange,
} = {}) {
  const textareaRef = useRef(null);
  const initialTextRef = useRef(initialText);

  const notifyContentChange = useCallback(() => {
    if (!onContentChange || !textareaRef.current) {
      return;
    }

    onContentChange(pageTextToContent(textareaRef.current.value));
  }, [onContentChange]);

  const applyNormalizedValue = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return false;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const normalizedText = linesToPageText(splitPageText(textarea.value));

    if (normalizedText === textarea.value) {
      return false;
    }

    textarea.value = normalizedText;

    const nextSelectionStart = Math.min(selectionStart, normalizedText.length);
    const nextSelectionEnd = Math.min(selectionEnd, normalizedText.length);
    textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd);

    return true;
  }, []);

  const handleInput = useCallback(() => {
    applyNormalizedValue();
    notifyContentChange();
  }, [applyNormalizedValue, notifyContentChange]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!textareaRef.current) {
        return;
      }

      handleTextareaKeyDown(event, textareaRef.current);

      if (event.defaultPrevented) {
        applyNormalizedValue();
        window.requestAnimationFrame(notifyContentChange);
      }
    },
    [applyNormalizedValue, notifyContentChange],
  );

  const handlePaste = useCallback(
    (event) => {
      if (!textareaRef.current) {
        return;
      }

      handleTextareaPaste(event, textareaRef.current);
      applyNormalizedValue();
      window.requestAnimationFrame(notifyContentChange);
    },
    [applyNormalizedValue, notifyContentChange],
  );

  const handleFocus = useCallback(() => {
    onInputFocus?.();
  }, [onInputFocus]);

  useEffect(() => {
    if (!autoFocusContent || !textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    textarea.focus();
    const cursorPosition = getLineStartPosition(initialTextRef.current, CONTENT_LINE_START);
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  }, [autoFocusContent]);

  return {
    textareaRef,
    defaultValue: initialTextRef.current,
    handleInput,
    handleKeyDown,
    handlePaste,
    handleFocus,
  };
}
