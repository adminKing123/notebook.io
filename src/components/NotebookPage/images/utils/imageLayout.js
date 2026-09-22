export const DEFAULT_IMAGE_WIDTH = 45;

export function getImageHeightPercent(widthPercent, containerRect, aspectRatio) {
  if (!containerRect?.width || !containerRect?.height || !aspectRatio) {
    return widthPercent;
  }

  const widthPx = (widthPercent / 100) * containerRect.width;
  const heightPx = widthPx / aspectRatio;

  return (heightPx / containerRect.height) * 100;
}

export function createDefaultImageLayout(aspectRatio) {
  const width = DEFAULT_IMAGE_WIDTH;

  return {
    x: (100 - width) / 2,
    y: 18,
    width,
    aspectRatio,
  };
}
