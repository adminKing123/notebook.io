export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        src,
        aspectRatio: image.naturalWidth / image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error('Failed to load image'));
    };

    image.src = src;
  });
}

export function revokeImageSrc(src) {
  if (src?.startsWith('blob:')) {
    URL.revokeObjectURL(src);
  }
}
