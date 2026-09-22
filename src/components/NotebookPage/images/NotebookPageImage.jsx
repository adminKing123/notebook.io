import { useCallback, useEffect, useState } from 'react';
import Spinner from '../../ui/Spinner';
import { RESIZE_HANDLES } from './constants';
import { useImageTransform } from './hooks/useImageTransform';

export default function NotebookPageImage({
  image,
  isSelected,
  containerRef,
  onSelect,
  onChange,
}) {
  const isLocalSrc = image.src?.startsWith('blob:');
  const [isLoaded, setIsLoaded] = useState(isLocalSrc || !image.src);

  useEffect(() => {
    setIsLoaded(isLocalSrc || !image.src);
  }, [image.src, isLocalSrc]);

  const handleChange = useCallback(
    (patch) => {
      onChange(image.id, patch);
    },
    [image.id, onChange],
  );

  const { startDrag, startResize } = useImageTransform({
    containerRef,
    onChange: handleChange,
  });

  const showSkeleton = !isLoaded && !image.uploading;

  return (
    <div
      className={
        isSelected
          ? 'notebook-page__image notebook-page__image--selected'
          : 'notebook-page__image'
      }
      style={{
        left: `${image.x}%`,
        top: `${image.y}%`,
        width: `${image.width}%`,
        aspectRatio: image.aspectRatio,
      }}
      onPointerDown={(event) => {
        onSelect(image.id);
        startDrag(event, image);
      }}
    >
      {showSkeleton && (
        <span className="notebook-page__image-skeleton" aria-hidden="true" />
      )}

      {image.src && (
        <img
          className={
            isLoaded
              ? 'notebook-page__image-content notebook-page__image-content--loaded'
              : 'notebook-page__image-content'
          }
          src={image.src}
          alt=""
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      )}

      {image.uploading && (
        <span className="notebook-page__image-uploading" aria-hidden="true">
          <Spinner size="sm" label="Uploading image" />
        </span>
      )}

      {isSelected &&
        !image.uploading &&
        RESIZE_HANDLES.map((corner) => (
          <span
            key={corner}
            role="presentation"
            className={`notebook-page__image-handle notebook-page__image-handle--${corner}`}
            onPointerDown={(event) => startResize(event, corner, image)}
          />
        ))}
    </div>
  );
}
