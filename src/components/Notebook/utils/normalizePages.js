import { createId } from '../../../utils/createId';

export function normalizePages(pages) {
  return pages.map((page, index) => ({
    ...page,
    id: page.id ?? `page-${index}-${createId()}`,
    images: page.images ?? [],
  }));
}
