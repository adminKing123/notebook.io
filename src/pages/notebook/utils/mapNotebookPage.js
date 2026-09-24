import { contentLinesToText, parseApiContent } from './pageContent';

export function mapApiPageImage(image) {
  return {
    id: image.id,
    src: image.url,
    x: image.x,
    y: image.y,
    width: image.width,
    aspectRatio: image.aspect_ratio,
  };
}

export function mapApiPage(page) {
  return {
    id: page.id,
    pageNumber: page.page_number,
    title: page.heading ?? '',
    subtitle: page.subheading ?? '',
    content: parseApiContent(page.content),
    images: Array.isArray(page.images) ? page.images.map(mapApiPageImage) : [],
    loading: false,
  };
}

export function createLoadingPlaceholder(pageNumber) {
  return {
    id: `loading-${pageNumber}`,
    pageNumber,
    title: '',
    subtitle: '',
    content: '',
    images: [],
    loading: true,
  };
}

export function mergePageWindow(previousPages, windowResponse) {
  const totalPages = windowResponse.total_pages;
  const loadedByNumber = new Map(
    windowResponse.pages.map((page) => [page.page_number, mapApiPage(page)]),
  );

  return Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;

    if (loadedByNumber.has(pageNumber)) {
      return loadedByNumber.get(pageNumber);
    }

    const existing = previousPages[index];
    if (existing && !existing.loading) {
      return existing;
    }

    return createLoadingPlaceholder(pageNumber);
  });
}

export function serializePageForSave(page) {
  return {
    heading: page.title ?? '',
    subheading: page.subtitle ?? '',
    content: contentLinesToText(page.content),
    images: (page.images ?? []).map((image) => ({
      id: image.id,
      ...(image.src && !image.src.startsWith('blob:') ? { url: image.src } : {}),
      x: image.x,
      y: image.y,
      width: image.width,
      aspect_ratio: image.aspectRatio,
    })),
  };
}
