import {
  CONTENT_LINE_COUNT,
  CONTENT_LINE_START,
  LINE_CHAR_ALLOWED,
  SUBTITLE_LINE_INDEX,
  TITLE_LINE_INDEX,
  TOTAL_LINES,
} from '../constants';

function truncateLine(value) {
  return String(value ?? '').slice(0, LINE_CHAR_ALLOWED);
}

export function normalizePageLines(rawLines) {
  return rawLines.slice(0, TOTAL_LINES).map(truncateLine);
}

export function splitPageText(text) {
  if (!text) {
    return Array.from({ length: TOTAL_LINES }, () => '');
  }

  const rawLines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const lines = [];

  for (const segment of rawLines) {
    if (lines.length >= TOTAL_LINES) {
      break;
    }

    if (segment.length === 0) {
      lines.push('');
      continue;
    }

    let remaining = segment;

    while (remaining.length > 0 && lines.length < TOTAL_LINES) {
      lines.push(remaining.slice(0, LINE_CHAR_ALLOWED));
      remaining = remaining.slice(LINE_CHAR_ALLOWED);
    }
  }

  while (lines.length < TOTAL_LINES) {
    lines.push('');
  }

  return lines;
}

export function linesToPageText(lines) {
  return normalizePageLines(lines).join('\n');
}

export function pageTextToContent(text) {
  const lines = splitPageText(text);

  return {
    title: lines[TITLE_LINE_INDEX] ?? '',
    subtitle: lines[SUBTITLE_LINE_INDEX] ?? '',
    content: lines.slice(CONTENT_LINE_START, CONTENT_LINE_START + CONTENT_LINE_COUNT),
  };
}

export function getLineIndexAtPosition(text, position) {
  const clampedPosition = Math.max(0, Math.min(position, text.length));
  let lineIndex = 0;

  for (let index = 0; index < clampedPosition; index += 1) {
    if (text[index] === '\n') {
      lineIndex += 1;
    }
  }

  return Math.min(lineIndex, TOTAL_LINES - 1);
}

export function getLineStartPosition(text, lineIndex) {
  const lines = text.split('\n');
  let position = 0;

  for (let index = 0; index < lineIndex; index += 1) {
    position += (lines[index]?.length ?? 0) + 1;
  }

  return position;
}

export function getLineInfoAtPosition(text, position) {
  const lineIndex = getLineIndexAtPosition(text, position);
  const lineStart = getLineStartPosition(text, lineIndex);
  const nextBreak = text.indexOf('\n', lineStart);
  const lineEnd = nextBreak === -1 ? text.length : nextBreak;
  const lineText = text.slice(lineStart, lineEnd);

  return {
    lineIndex,
    lineStart,
    lineEnd,
    lineText,
    offsetInLine: position - lineStart,
  };
}
