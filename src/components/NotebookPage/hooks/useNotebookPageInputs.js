import { useCallback, useEffect, useRef } from 'react';
import { CONTENT_LINE_START, TOTAL_LINES } from '../constants';
import {
  handleNotebookPageKeyDown,
  handleNotebookPagePaste,
} from '../utils/notebookPageInputHandlers';

export function useNotebookPageInputs({
  autoFocusContent = true,
  onInputFocus,
} = {}) {
  const pageInputRefs = useRef([]);

  const getPageInputs = useCallback(
    () => pageInputRefs.current.filter(Boolean),
    [],
  );

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
    },
    [getPageInputs],
  );

  const createPasteHandler = useCallback(
    (index) => (event) => {
      handleNotebookPagePaste(event, {
        inputs: getPageInputs(),
        currentIndex: index,
        maxLines: TOTAL_LINES,
      });
    },
    [getPageInputs],
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
    createFocusHandler,
  };
}
