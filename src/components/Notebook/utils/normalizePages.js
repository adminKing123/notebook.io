export function createPageId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function normalizePages(pages) {
  return pages.map((page, index) => ({
    ...page,
    id: page.id ?? `page-${index}-${createPageId()}`,
  }));
}
