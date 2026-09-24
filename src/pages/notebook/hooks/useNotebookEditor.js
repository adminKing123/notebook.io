import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createNotebookPage,
  deleteNotebookPage,
  fetchPageWindow,
  saveNotebookPage,
  uploadNotebookPageImage,
} from '../../../api/notebookPages';
import {
  loadImageFromFile,
  revokeImageSrc,
} from '../../../components/NotebookPage/images/utils/loadImageFromFile';
import { createId } from '../../../utils/createId';
import { AUTOSAVE_DEBOUNCE_MS, PAGE_WINDOW_SIZE } from '../constants';
import { contentLinesToText } from '../utils/pageContent';
import {
  mapApiPage,
  mergePageWindow,
  serializePageForSave,
} from '../utils/mapNotebookPage';
import {
  buildLibraryPlacements,
  buildUploadedPlacement,
  buildUploadingPlacement,
} from '../utils/pageImages';

export function useNotebookEditor(notebookId) {
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isWindowLoading, setIsWindowLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const pagesRef = useRef(pages);
  pagesRef.current = pages;

  const loadPageWindow = useCallback(
    async (centerPage, { showWindowLoader = true } = {}) => {
      if (!notebookId) {
        return;
      }

      if (showWindowLoader) {
        setIsWindowLoading(true);
      }

      try {
        const windowResponse = await fetchPageWindow(notebookId, {
          center: centerPage,
          window: PAGE_WINDOW_SIZE,
        });
        setTotalPages(windowResponse.total_pages);
        setPages((previousPages) => mergePageWindow(previousPages, windowResponse));
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        if (showWindowLoader) {
          setIsWindowLoading(false);
        }
      }
    },
    [notebookId],
  );

  const debouncedSave = useMemo(
    () =>
      debounce(async (pageId, payload) => {
        if (!notebookId || !pageId || pageId.startsWith('loading-')) {
          return;
        }

        setIsSaving(true);

        try {
          await saveNotebookPage(notebookId, pageId, payload);
        } catch (requestError) {
          setError(requestError.message);
        } finally {
          setIsSaving(false);
        }
      }, AUTOSAVE_DEBOUNCE_MS),
    [notebookId],
  );

  useEffect(() => () => debouncedSave.cancel(), [debouncedSave]);

  useEffect(() => {
    let isMounted = true;

    async function initializeNotebook() {
      if (!notebookId) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const windowResponse = await fetchPageWindow(notebookId, {
          center: 1,
          window: PAGE_WINDOW_SIZE,
        });

        if (!isMounted) {
          return;
        }

        setTotalPages(windowResponse.total_pages);
        setPages(mergePageWindow([], windowResponse));
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeNotebook();

    return () => {
      isMounted = false;
    };
  }, [notebookId]);

  const handlePageIndexChange = useCallback(
    (pageIndex) => {
      const page = pagesRef.current[pageIndex];
      if (!page?.loading) {
        return;
      }

      loadPageWindow(pageIndex + 1, { showWindowLoader: true });
    },
    [loadPageWindow],
  );

  const scheduleSave = useCallback(
    (pageSnapshot) => {
      if (!pageSnapshot?.id || pageSnapshot.loading || pageSnapshot.id.startsWith('loading-')) {
        return;
      }

      debouncedSave(pageSnapshot.id, serializePageForSave(pageSnapshot));
    },
    [debouncedSave],
  );

  const commitPageUpdate = useCallback(
    (pageIndex, updatedPage, { save = true } = {}) => {
      pagesRef.current = pagesRef.current.map((page, index) =>
        index === pageIndex ? updatedPage : page,
      );
      setPages(pagesRef.current);

      if (save) {
        scheduleSave(updatedPage);
      }

      return updatedPage;
    },
    [scheduleSave],
  );

  const handleContentChange = useCallback(
    (pageIndex, content) => {
      const currentPage = pagesRef.current[pageIndex];
      if (!currentPage) {
        return;
      }

      commitPageUpdate(pageIndex, {
        ...currentPage,
        title: content.title,
        subtitle: content.subtitle,
        content: contentLinesToText(content.content),
      });
    },
    [commitPageUpdate],
  );

  const handleUpdateImage = useCallback(
    (pageIndex, imageId, patch) => {
      const currentPage = pagesRef.current[pageIndex];
      if (!currentPage) {
        return;
      }

      commitPageUpdate(pageIndex, {
        ...currentPage,
        images: currentPage.images.map((image) =>
          image.id === imageId ? { ...image, ...patch } : image,
        ),
      });
    },
    [commitPageUpdate],
  );

  const handleImportImage = useCallback(
    async (pageIndex, file) => {
      const page = pagesRef.current[pageIndex];
      if (!page?.id || page.loading || !file?.type.startsWith('image/')) {
        return null;
      }

      try {
        const { src, aspectRatio } = await loadImageFromFile(file);
        const placementId = createId();

        setPages((previousPages) =>
          previousPages.map((currentPage, index) =>
            index === pageIndex
              ? {
                  ...currentPage,
                  images: [
                    ...currentPage.images,
                    buildUploadingPlacement({ placementId, src, aspectRatio }),
                  ],
                }
              : currentPage,
          ),
        );

        const uploadedImage = await uploadNotebookPageImage(notebookId, page.id, file);
        revokeImageSrc(src);

        const currentImages = pagesRef.current[pageIndex].images.filter(
          (image) => image.id !== placementId,
        );
        const pageWithUploadedImage = commitPageUpdate(
          pageIndex,
          {
            ...pagesRef.current[pageIndex],
            images: [
              ...currentImages,
              buildUploadedPlacement({ placementId, uploadedImage, aspectRatio }),
            ],
          },
          { save: true },
        );

        return pageWithUploadedImage.images.at(-1)?.id ?? placementId;
      } catch (requestError) {
        setError(requestError.message);
        return null;
      }
    },
    [commitPageUpdate, notebookId],
  );

  const handleImportExistingImages = useCallback(
    async (pageIndex, apiImages) => {
      const page = pagesRef.current[pageIndex];
      if (!page?.id || page.loading || !Array.isArray(apiImages) || apiImages.length === 0) {
        return null;
      }

      try {
        const newImages = buildLibraryPlacements(apiImages);
        const updatedPage = commitPageUpdate(pageIndex, {
          ...page,
          images: [...page.images, ...newImages],
        });

        return newImages.at(-1)?.id ?? null;
      } catch (requestError) {
        setError(requestError.message);
        return null;
      }
    },
    [commitPageUpdate],
  );

  const handleDeleteImage = useCallback(
    (pageIndex, imageId) => {
      const currentPage = pagesRef.current[pageIndex];
      if (!currentPage) {
        return;
      }

      const removedImage = currentPage.images.find((image) => image.id === imageId);
      if (removedImage?.src?.startsWith('blob:')) {
        revokeImageSrc(removedImage.src);
      }

      commitPageUpdate(pageIndex, {
        ...currentPage,
        images: currentPage.images.filter((image) => image.id !== imageId),
      });
    },
    [commitPageUpdate],
  );

  const handleAddPage = useCallback(async () => {
    try {
      const createdPage = await createNotebookPage(notebookId);
      setTotalPages(createdPage.page_number);
      setPages((previousPages) => [...previousPages, mapApiPage(createdPage)]);

      return createdPage.page_number;
    } catch (requestError) {
      setError(requestError.message);
      return null;
    }
  }, [notebookId]);

  const handleRemovePage = useCallback(
    async (pageIndex) => {
      const page = pagesRef.current[pageIndex];

      if (!page || totalPages <= 1 || page.loading) {
        return null;
      }

      try {
        await deleteNotebookPage(notebookId, page.id);
        page.images?.forEach((image) => {
          if (image.src?.startsWith('blob:')) {
            revokeImageSrc(image.src);
          }
        });

        const nextIndex = pageIndex >= totalPages - 1 ? pageIndex - 1 : pageIndex;
        await loadPageWindow(nextIndex + 1, { showWindowLoader: true });

        return Math.max(nextIndex, 0);
      } catch (requestError) {
        setError(requestError.message);
        return null;
      }
    },
    [loadPageWindow, notebookId, totalPages],
  );

  return {
    pages,
    setPages,
    totalPages,
    isLoading,
    isWindowLoading,
    isSaving,
    error,
    handlePageIndexChange,
    handleContentChange,
    handleUpdateImage,
    handleImportImage,
    handleImportExistingImages,
    handleDeleteImage,
    handleAddPage,
    handleRemovePage,
  };
}
