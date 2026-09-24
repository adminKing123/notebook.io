export function parseApiContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.join('\n');
  }

  return '';
}

export function contentLinesToText(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.join('\n');
  }

  return '';
}
