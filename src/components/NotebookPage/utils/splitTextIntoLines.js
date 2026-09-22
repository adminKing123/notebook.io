import { LINE_CHAR_ALLOWED } from '../constants';

export function chunkText(text, maxLines, lineCharLimit = LINE_CHAR_ALLOWED) {
  const result = [];
  let remaining = text;

  while (remaining.length > 0 && result.length < maxLines) {
    result.push(remaining.slice(0, lineCharLimit));
    remaining = remaining.slice(lineCharLimit);
  }

  return result;
}

export function splitTextIntoLines(text, maxLines, lineCharLimit = LINE_CHAR_ALLOWED) {
  if (!text) return [];

  const result = [];

  for (const segment of text.split('\n')) {
    const chunks = chunkText(segment, maxLines - result.length, lineCharLimit);
    result.push(...chunks);

    if (result.length >= maxLines) break;
  }

  return result;
}
