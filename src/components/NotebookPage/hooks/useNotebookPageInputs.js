import { useCallback, useEffect, useRef } from 'react';
import { CONTENT_LINE_START, TOTAL_LINES } from '../constants';
import { extractPageContent } from '../utils/extractPageContent';
import {
  handleNotebookPageKeyDown,
  handleNotebookPagePaste,
} from '../utils/notebookPageInputHandlers';

export function useNotebookPageInputs({
  autoFocusContent = true,
  onInputFocus,
  onContentChange,
} = {}) {
  const pageInputRefs = useRef([]);

  const getPageInputs = useCallback(
    () => pageInputRefs.current.filter(Boolean),
    [],
  );

  const notifyContentChange = useCallback(() => {
    if (!onContentChange) {
      return;
    }

    onContentChange(extractPageContent(pageInputRefs.current));
  }, [onContentChange]);

  const registerPageInput = useCallback(
    (index) => (element) => {
      pageInputRefs.current[index] = element;
    },
    [],
  );

  const createKeyDownHandler = useCallback(
    (index) => (event) => {
      handleNotebookPageKeyDown(event, {
        inputs: getPageInputs(),
        currentIndex: index,
        maxLines: TOTAL_LINES,
      });

      if (event.defaultPrevented) {
        window.requestAnimationFrame(notifyContentChange);
      }
    },
    [getPageInputs, notifyContentChange],
  );

  const createPasteHandler = useCallback(
    (index) => (event) => {
      handleNotebookPagePaste(event, {
        inputs: getPageInputs(),
        currentIndex: index,
        maxLines: TOTAL_LINES,
      });
      window.requestAnimationFrame(notifyContentChange);
    },
    [getPageInputs, notifyContentChange],
  );

  const createInputHandler = useCallback(
    () => () => {
      notifyContentChange();
    },
    [notifyContentChange],
  );

  const createFocusHandler = useCallback(
    () => () => {
      onInputFocus?.();
    },
    [onInputFocus],
  );

  useEffect(() => {
    if (autoFocusContent) {
      pageInputRefs.current[CONTENT_LINE_START]?.focus();
    }
  }, [autoFocusContent]);

  return {
    registerPageInput,
    createKeyDownHandler,
    createPasteHandler,
    createInputHandler,
    createFocusHandler,
  };
}
