import { useCallback } from 'react';
import NotebookPageImage from './NotebookPageImage';

export default function NotebookPageImages({
  images = [],
  selectedImageId,
  onSelectImage,
  onUpdateImage,
  containerRef,
}) {
  const handleUpdateImage = useCallback(
    (imageId, patch) => {
      onUpdateImage(imageId, patch);
    },
    [onUpdateImage],
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className="notebook-page__images"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onSelectImage(null);
        }
      }}
    >
      {images.map((image) => (
        <NotebookPageImage
          key={image.id}
          image={image}
          isSelected={image.id === selectedImageId}
          containerRef={containerRef}
          onSelect={onSelectImage}
          onChange={handleUpdateImage}
        />
      ))}
    </div>
  );
}
