import { contentLinesToText, parseApiContent } from './pageContent';

export function mapEmbeddedImage(embedded) {
  return {
    id: embedded.id,
    imageId: embedded.image_id,
    src: embedded.url,
    x: embedded.x,
    y: embedded.y,
    width: embedded.width,
    aspectRatio: embedded.aspect_ratio,
  };
}

export function mapEmbeddedImagesFromConfig(config) {
  const embeddedImages = config?.embedded_images;
  return Array.isArray(embeddedImages) ? embeddedImages.map(mapEmbeddedImage) : [];
}

export function mapApiPage(page) {
  return {
    id: page.id,
    pageNumber: page.page_number,
    title: page.heading ?? '',
    subtitle: page.subheading ?? '',
    content: parseApiContent(page.content),
    images: mapEmbeddedImagesFromConfig(page.config),
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
    config: {
      embedded_images: (page.images ?? [])
        .filter((image) => image.imageId && !image.uploading)
        .map((image) => ({
          id: image.id,
          image_id: image.imageId,
          x: image.x,
          y: image.y,
          width: image.width,
          aspect_ratio: image.aspectRatio,
        })),
    },
  };
}
