import NotebookAccessBadge from '../notebooks/NotebookAccessBadge';
import NotebookCardThumbnail from '../notebooks/NotebookCardThumbnail';
import '../notebooks/notebooks.css';

export default function ThumbnailPreview({ title, description, access, imageSrc }) {
  const displayTitle = title.trim() || 'Untitled notebook';

  return (
    <article className="create-notebook-preview">
      <p className="create-notebook-preview__label">Preview</p>

      <div className="create-notebook-preview__card">
        {imageSrc ? (
          <div className="create-notebook-preview__thumbnail">
            <img
              src={imageSrc}
              alt=""
              className="create-notebook-preview__image"
            />
            <span className="create-notebook-preview__thumbnail-label">{displayTitle}</span>
          </div>
        ) : (
          <NotebookCardThumbnail title={displayTitle} />
        )}

        <div className="create-notebook-preview__body">
          <div className="create-notebook-preview__meta">
            <h3 className="create-notebook-preview__title">{displayTitle}</h3>
            <NotebookAccessBadge access={access} />
          </div>

          {description.trim() ? (
            <p className="create-notebook-preview__description">{description}</p>
          ) : (
            <p className="create-notebook-preview__description create-notebook-preview__description--placeholder">
              Your description will appear here.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
