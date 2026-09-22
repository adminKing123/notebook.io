import {
  CONTENT_LINE_COUNT,
  CONTENT_LINE_START,
  SUBTITLE_LINE_INDEX,
  TITLE_LINE_INDEX,
} from '../constants';

export function extractPageContent(inputRefs) {
  const inputs = inputRefs.filter(Boolean);

  return {
    title: inputs[TITLE_LINE_INDEX]?.value ?? '',
    subtitle: inputs[SUBTITLE_LINE_INDEX]?.value ?? '',
    content: inputs
      .slice(CONTENT_LINE_START, CONTENT_LINE_START + CONTENT_LINE_COUNT)
      .map((input) => input.value ?? ''),
  };
}
