import { useCallback, useEffect, useRef, useState } from 'react';

function isImageReady(imageElement) {
  return Boolean(imageElement?.complete && imageElement.naturalWidth > 0);
}

export function useImageLoadState(src) {
  const isLocalSrc = src?.startsWith('blob:');
  const imageRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(() => isLocalSrc || !src);

  const syncLoadedFromImage = useCallback(() => {
    if (isImageReady(imageRef.current)) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    setIsLoaded(isLocalSrc || !src);

    if (!src || isLocalSrc) {
      return undefined;
    }

    syncLoadedFromImage();
    const frameId = window.requestAnimationFrame(syncLoadedFromImage);

    return () => window.cancelAnimationFrame(frameId);
  }, [src, isLocalSrc, syncLoadedFromImage]);

  const setImageRef = useCallback(
    (node) => {
      imageRef.current = node;
      syncLoadedFromImage();
    },
    [syncLoadedFromImage],
  );

  const markLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    setImageRef,
    isLoaded,
    markLoaded,
  };
}
