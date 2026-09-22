export function formatNotebookDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatPageCount(count) {
  return count === 1 ? '1 page' : `${count} pages`;
}
