import {
  CONTENT_LINE_COUNT,
  CONTENT_LINE_START,
  LINE_CHAR_ALLOWED,
  SUBTITLE_LINE_INDEX,
  TITLE_LINE_INDEX,
  TOTAL_LINES,
} from '../constants';
import { formatTodaySubtitle } from './formatTodaySubtitle';
import { splitTextIntoLines } from './splitTextIntoLines';

function truncateLine(value) {
  return value.slice(0, LINE_CHAR_ALLOWED);
}

export function buildInitialLines({ title = '', subtitle, content = '' } = {}) {
  const lines = Array.from({ length: TOTAL_LINES }, () => '');

  lines[TITLE_LINE_INDEX] = truncateLine(title);
  lines[SUBTITLE_LINE_INDEX] = truncateLine(subtitle ?? formatTodaySubtitle());

  const contentLines = splitTextIntoLines(
    typeof content === 'string' ? content : '',
    CONTENT_LINE_COUNT,
  );

  contentLines.slice(0, CONTENT_LINE_COUNT).forEach((line, index) => {
    lines[CONTENT_LINE_START + index] = line;
  });

  return lines;
}
