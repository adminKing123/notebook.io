import { useCallback, useEffect, useState } from 'react';
import { createDefaultImageLayout } from '../../NotebookPage/images/utils/imageLayout';
import {
  loadImageFromFile,
  revokeImageSrc,
} from '../../NotebookPage/images/utils/loadImageFromFile';
import { createPageId } from '../utils/normalizePages';

export function useNotebookPageImages({
  pages,
  setPages,
  currentPageIndex,
  isAnimatingRef,
}) {
  const [selectedImageId, setSelectedImageId] = useState(null);
  const currentPageImages = pages[currentPageIndex]?.images ?? [];

  const revokePageImages = useCallback((page) => {
    page.images?.forEach((image) => revokeImageSrc(image.src));
  }, []);

  const importImage = useCallback(
    async (file) => {
      if (isAnimatingRef.current || !file?.type.startsWith('image/')) {
        return;
      }

      try {
        const { src, aspectRatio } = await loadImageFromFile(file);
        const layout = createDefaultImageLayout(aspectRatio);
        const id = createPageId();

        setPages((previousPages) =>
          previousPages.map((page, index) =>
            index === currentPageIndex
              ? {
                  ...page,
                  images: [...page.images, { id, src, ...layout }],
                }
              : page,
          ),
        );
        setSelectedImageId(id);
      } catch {
        // Ignore invalid image files.
      }
    },
    [currentPageIndex, isAnimatingRef, setPages],
  );

  const updatePageImage = useCallback(
    (imageId, patch) => {
      setPages((previousPages) =>
        previousPages.map((page, index) => {
          if (index !== currentPageIndex) {
            return page;
          }

          return {
            ...page,
            images: page.images.map((image) =>
              image.id === imageId ? { ...image, ...patch } : image,
            ),
          };
        }),
      );
    },
    [currentPageIndex, setPages],
  );

  const deleteSelectedImage = useCallback(() => {
    if (!selectedImageId) {
      return;
    }

    setPages((previousPages) =>
      previousPages.map((page, index) => {
        if (index !== currentPageIndex) {
          return page;
        }

        const removedImage = page.images.find((image) => image.id === selectedImageId);
        if (removedImage) {
          revokeImageSrc(removedImage.src);
        }

        return {
          ...page,
          images: page.images.filter((image) => image.id !== selectedImageId),
        };
      }),
    );
    setSelectedImageId(null);
  }, [currentPageIndex, selectedImageId, setPages]);

  useEffect(() => {
    const hasSelectedImage = currentPageImages.some(
      (image) => image.id === selectedImageId,
    );

    if (!hasSelectedImage) {
      setSelectedImageId(null);
    }
  }, [currentPageImages, selectedImageId]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        selectedImageId &&
        !(event.target instanceof HTMLInputElement)
      ) {
        event.preventDefault();
        deleteSelectedImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteSelectedImage, selectedImageId]);

  return {
    selectedImageId,
    setSelectedImageId,
    currentPageImages,
    importImage,
    updatePageImage,
    deleteSelectedImage,
    revokePageImages,
    canDeleteSelectedImage: currentPageImages.some(
      (image) => image.id === selectedImageId,
    ),
  };
}
