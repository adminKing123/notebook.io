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

export function createStaggeredImageLayout(aspectRatio, index) {
  const layout = createDefaultImageLayout(aspectRatio);
  const column = index % 3;
  const row = Math.floor(index / 3);

  return {
    ...layout,
    x: Math.min(85, layout.x + column * 4),
    y: Math.min(75, layout.y + row * 10),
  };
}
