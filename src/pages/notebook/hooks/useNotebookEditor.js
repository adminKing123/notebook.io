import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createNotebookPage,
  deleteNotebookPage,
  fetchNotebookDetail,
  fetchPageWindow,
  saveNotebookPage,
  uploadNotebookPageImage,
} from '../../../api/notebookPages';
import {
  createDefaultImageLayout,
  createStaggeredImageLayout,
} from '../../../components/NotebookPage/images/utils/imageLayout';
import {
  loadImageFromFile,
  revokeImageSrc,
} from '../../../components/NotebookPage/images/utils/loadImageFromFile';
import { createPageId } from '../../../components/Notebook/utils/normalizePages';
import { AUTOSAVE_DEBOUNCE_MS, PAGE_WINDOW_SIZE } from '../constants';
import { contentLinesToText } from '../utils/pageContent';
import {
  mapApiPage,
  mergePageWindow,
  serializePageForSave,
} from '../utils/mapNotebookPage';

export function useNotebookEditor(notebookId) {
  const [notebookMeta, setNotebookMeta] = useState(null);
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
        const [meta, windowResponse] = await Promise.all([
          fetchNotebookDetail(notebookId),
          fetchPageWindow(notebookId, { center: 1, window: PAGE_WINDOW_SIZE }),
        ]);

        if (!isMounted) {
          return;
        }

        setNotebookMeta(meta);
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

  const handleContentChange = useCallback(
    (pageIndex, content) => {
      const currentPage = pagesRef.current[pageIndex];
      if (!currentPage) {
        return;
      }

      const updatedPage = {
        ...currentPage,
        title: content.title,
        subtitle: content.subtitle,
        content: contentLinesToText(content.content),
      };

      pagesRef.current = pagesRef.current.map((page, index) =>
        index === pageIndex ? updatedPage : page,
      );
      setPages(pagesRef.current);
      scheduleSave(updatedPage);
    },
    [scheduleSave],
  );

  const handleUpdateImage = useCallback(
    (pageIndex, imageId, patch) => {
      const currentPage = pagesRef.current[pageIndex];
      if (!currentPage) {
        return;
      }

      const updatedPage = {
        ...currentPage,
        images: currentPage.images.map((image) =>
          image.id === imageId ? { ...image, ...patch } : image,
        ),
      };

      pagesRef.current = pagesRef.current.map((page, index) =>
        index === pageIndex ? updatedPage : page,
      );
      setPages(pagesRef.current);
      scheduleSave(updatedPage);
    },
    [scheduleSave],
  );

  const handleImportImage = useCallback(
    async (pageIndex, file) => {
      const page = pagesRef.current[pageIndex];
      if (!page?.id || page.loading || !file?.type.startsWith('image/')) {
        return null;
      }

      try {
        const { src, aspectRatio } = await loadImageFromFile(file);
        const layout = createDefaultImageLayout(aspectRatio);
        const tempId = createPageId();

        setPages((previousPages) =>
          previousPages.map((currentPage, index) =>
            index === pageIndex
              ? {
                  ...currentPage,
                  images: [
                    ...currentPage.images,
                    { id: tempId, imageId: null, src, ...layout, uploading: true },
                  ],
                }
              : currentPage,
          ),
        );

        const uploadedImage = await uploadNotebookPageImage(notebookId, page.id, file);
        revokeImageSrc(src);

        const pageWithUploadedImage = {
          ...pagesRef.current[pageIndex],
          images: pagesRef.current[pageIndex].images
            .filter((image) => image.id !== tempId)
            .concat({
              id: tempId,
              imageId: uploadedImage.id,
              src: uploadedImage.url,
              ...layout,
            }),
        };

        pagesRef.current = pagesRef.current.map((currentPage, index) =>
          index === pageIndex ? pageWithUploadedImage : currentPage,
        );
        setPages(pagesRef.current);

        scheduleSave(pageWithUploadedImage);
        return tempId;
      } catch (requestError) {
        setError(requestError.message);
        return null;
      }
    },
    [notebookId, scheduleSave],
  );

  const handleImportExistingImages = useCallback(
    async (pageIndex, apiImages) => {
      const page = pagesRef.current[pageIndex];
      if (!page?.id || page.loading || !Array.isArray(apiImages) || apiImages.length === 0) {
        return null;
      }

      try {
        const newImages = apiImages.map((apiImage, index) => {
          const aspectRatio = apiImage.aspect_ratio > 0 ? apiImage.aspect_ratio : 1;
          const layout = createStaggeredImageLayout(aspectRatio, index);

          return {
            id: createPageId(),
            imageId: apiImage.id,
            src: apiImage.url,
            ...layout,
          };
        });

        const updatedPage = {
          ...page,
          images: [...page.images, ...newImages],
        };

        pagesRef.current = pagesRef.current.map((currentPage, index) =>
          index === pageIndex ? updatedPage : currentPage,
        );
        setPages(pagesRef.current);
        scheduleSave(updatedPage);

        return newImages[newImages.length - 1]?.id ?? null;
      } catch (requestError) {
        setError(requestError.message);
        return null;
      }
    },
    [scheduleSave],
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

      const updatedPage = {
        ...currentPage,
        images: currentPage.images.filter((image) => image.id !== imageId),
      };

      pagesRef.current = pagesRef.current.map((page, index) =>
        index === pageIndex ? updatedPage : page,
      );
      setPages(pagesRef.current);
      scheduleSave(updatedPage);
    },
    [scheduleSave],
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
    notebookMeta,
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
