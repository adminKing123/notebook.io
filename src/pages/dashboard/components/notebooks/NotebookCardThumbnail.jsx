export default function NotebookCardThumbnail({ title }) {
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
      <span className="notebook-card__thumbnail-label">{title}</span>
    </div>
  );
}
