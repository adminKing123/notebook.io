import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchUserImages } from '../../../api/notebookPages';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../ui/Dialog';
import Spinner from '../../ui/Spinner';
import './uploaded-images-picker.css';
import '../../ui/dialog.css';

const PAGE_SIZE = 24;

export default function UploadedImagesPickerDialog({
  open,
  onOpenChange,
  onImport,
  maxSelection = 5,
}) {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(() => new Map());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const loadPage = useCallback(async (pageNumber, { replace = false } = {}) => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchUserImages({ page: pageNumber, pageSize: PAGE_SIZE });
      setImages((previousImages) =>
        replace ? response.results : [...previousImages, ...response.results],
      );
      setHasMore(response.has_more);
      setPage(pageNumber);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setSelectedImages(new Map());
      return undefined;
    }

    setImages([]);
    setPage(1);
    setHasMore(true);
    setError('');
    loadPage(1, { replace: true });

    return undefined;
  }, [loadPage, open]);

  useEffect(() => {
    if (!open || !hasMore || isLoading) {
      return undefined;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadPage(page + 1);
        }
      },
      { root: null, rootMargin: '160px 0px', threshold: 0 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, loadPage, open, page]);

  const toggleSelection = (image) => {
    setSelectedImages((previousSelection) => {
      const nextSelection = new Map(previousSelection);

      if (nextSelection.has(image.id)) {
        nextSelection.delete(image.id);
        return nextSelection;
      }

      if (nextSelection.size >= maxSelection) {
        return previousSelection;
      }

      nextSelection.set(image.id, image);
      return nextSelection;
    });
  };

  const handleImport = () => {
    if (selectedImages.size === 0) {
      return;
    }

    onImport(Array.from(selectedImages.values()));
    onOpenChange(false);
  };

  const selectionCount = selectedImages.size;
  const isSelectionFull = selectionCount >= maxSelection;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="uploaded-images-picker" aria-describedby="uploaded-images-picker-desc">
        <div className="uploaded-images-picker__header">
          <DialogTitle className="uploaded-images-picker__title">
            Uploaded images
          </DialogTitle>
          <DialogDescription
            id="uploaded-images-picker-desc"
            className="uploaded-images-picker__description"
          >
            Select up to {maxSelection} images to place on the current page.
          </DialogDescription>
        </div>

        <div className="uploaded-images-picker__toolbar">
          <span className="uploaded-images-picker__selection-count">
            {selectionCount} / {maxSelection} selected
          </span>
          <button
            type="button"
            className="uploaded-images-picker__import-button"
            onClick={handleImport}
            disabled={selectionCount === 0}
          >
            Import selected
          </button>
        </div>

        {error && (
          <p className="uploaded-images-picker__error" role="alert">
            {error}
          </p>
        )}

        <div className="uploaded-images-picker__body">
          {images.length === 0 && isLoading ? (
            <div className="uploaded-images-picker__loading">
              <Spinner size="md" label="Loading images" />
            </div>
          ) : images.length === 0 ? (
            <p className="uploaded-images-picker__empty">No uploaded images yet.</p>
          ) : (
            <div className="uploaded-images-picker__masonry">
              {images.map((image) => {
                const isSelected = selectedImages.has(image.id);
                const isDisabled = !isSelected && isSelectionFull;

                return (
                  <button
                    key={image.id}
                    type="button"
                    className={
                      isSelected
                        ? 'uploaded-images-picker__item uploaded-images-picker__item--selected'
                        : 'uploaded-images-picker__item'
                    }
                    disabled={isDisabled}
                    onClick={() => toggleSelection(image)}
                    aria-pressed={isSelected}
                    title={image.file_name}
                  >
                    <img
                      className="uploaded-images-picker__thumb"
                      src={image.url}
                      alt={image.file_name}
                      loading="lazy"
                    />
                    {isSelected && (
                      <span className="uploaded-images-picker__check" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div ref={sentinelRef} className="uploaded-images-picker__sentinel" aria-hidden="true" />

          {isLoading && images.length > 0 && (
            <div className="uploaded-images-picker__loading uploaded-images-picker__loading--inline">
              <Spinner size="sm" label="Loading more images" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
