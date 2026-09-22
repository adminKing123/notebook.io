import { useCallback } from 'react';
import { useImageTransform } from './hooks/useImageTransform';

const RESIZE_HANDLES = ['nw', 'ne', 'sw', 'se'];

export default function NotebookPageImage({
  image,
  isSelected,
  containerRef,
  onSelect,
  onChange,
}) {
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
      <img
        className="notebook-page__image-content"
        src={image.src}
        alt=""
        draggable={false}
      />

      {isSelected &&
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
