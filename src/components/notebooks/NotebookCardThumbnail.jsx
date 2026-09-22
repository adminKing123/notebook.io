import { useEffect, useState } from 'react';

export default function NotebookCardThumbnail({ imageSrc = '' }) {
  const [isLoaded, setIsLoaded] = useState(!imageSrc);

  useEffect(() => {
    setIsLoaded(!imageSrc);
  }, [imageSrc]);

  if (imageSrc) {
    return (
      <div className="notebook-card__thumbnail" aria-hidden="true">
        <div className="notebook-card__thumbnail-sheet notebook-card__thumbnail-sheet--image">
          {!isLoaded && (
            <span className="notebook-card__thumbnail-skeleton" aria-hidden="true" />
          )}
          <img
            src={imageSrc}
            alt=""
            className={
              isLoaded
                ? 'notebook-card__thumbnail-image notebook-card__thumbnail-image--loaded'
                : 'notebook-card__thumbnail-image'
            }
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="notebook-card__thumbnail" aria-hidden="true">
      <div className="notebook-card__thumbnail-sheet">
        <span className="notebook-card__thumbnail-margin" />
        <div className="notebook-card__thumbnail-lines">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
