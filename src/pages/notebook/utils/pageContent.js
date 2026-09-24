function contentToText(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.join('\n');
  }

  return '';
}

export function parseApiContent(content) {
  return contentToText(content);
}

export function contentLinesToText(content) {
  return contentToText(content);
}
