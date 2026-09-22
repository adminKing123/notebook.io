import { LINE_CHAR_ALLOWED } from '../constants';
import { chunkText } from './splitTextIntoLines';

export function handleNotebookPageKeyDown(event, { inputs, currentIndex, maxLines }) {
  const input = inputs[currentIndex];

  if (event.key === 'ArrowDown' || event.key === 'Enter') {
    event.preventDefault();
    if (currentIndex < maxLines - 1) inputs[currentIndex + 1].focus();
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (currentIndex > 0) inputs[currentIndex - 1].focus();
    return;
  }

  if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
    if (currentIndex < maxLines - 1) {
      event.preventDefault();
      inputs[currentIndex + 1].focus();
      inputs[currentIndex + 1].setSelectionRange(0, 0);
    }
    return;
  }

  if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
    if (currentIndex > 0) {
      event.preventDefault();
      inputs[currentIndex - 1].focus();
      const prevLen = inputs[currentIndex - 1].value.length;
      inputs[currentIndex - 1].setSelectionRange(prevLen, prevLen);
    }
    return;
  }

  if (event.key === 'Backspace' && input.selectionStart === 0 && input.selectionEnd === 0) {
    if (currentIndex > 0) {
      event.preventDefault();
      inputs[currentIndex - 1].focus();
      const prevLen = inputs[currentIndex - 1].value.length;
      inputs[currentIndex - 1].setSelectionRange(prevLen, prevLen);
    }
    return;
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    if (input.value.length >= LINE_CHAR_ALLOWED && input.selectionStart === input.value.length) {
      event.preventDefault();
      if (currentIndex < maxLines - 1) {
        inputs[currentIndex + 1].focus();
        if (inputs[currentIndex + 1].value.length < LINE_CHAR_ALLOWED) {
          inputs[currentIndex + 1].value = event.key + inputs[currentIndex + 1].value;
          inputs[currentIndex + 1].setSelectionRange(1, 1);
        }
      }
    }
  }
}

export function handleNotebookPagePaste(event, { inputs, currentIndex, maxLines }) {
  event.preventDefault();

  let text = (event.clipboardData || window.clipboardData).getData('text');
  text = text.replace(/[\r\n]+/g, ' ');

  const input = inputs[currentIndex];
  const cursorPosition = input.selectionStart;
  const textBefore = input.value.substring(0, cursorPosition);
  const textAfter = input.value.substring(input.selectionEnd);

  const combinedText = textBefore + text + textAfter;
  const chunks = chunkText(combinedText, maxLines - currentIndex);

  chunks.forEach((chunk, offset) => {
    inputs[currentIndex + offset].value = chunk;
  });

  const finalIdx = Math.min(currentIndex + chunks.length - 1, maxLines - 1);
  if (finalIdx >= 0) {
    inputs[finalIdx].focus();
    inputs[finalIdx].setSelectionRange(
      inputs[finalIdx].value.length,
      inputs[finalIdx].value.length,
    );
  }
}
