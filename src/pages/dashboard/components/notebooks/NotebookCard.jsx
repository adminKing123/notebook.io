import NotebookAccessBadge from './NotebookAccessBadge';
import NotebookCardInfo from './NotebookCardInfo';
import NotebookCardThumbnail from './NotebookCardThumbnail';

export default function NotebookCard({ notebook }) {
  const pageLabel = notebook.pageCount === 1 ? '1 page' : `${notebook.pageCount} pages`;

  return (
    <div className="notebook-card">
      <button type="button" className="notebook-card__main">
        <NotebookCardThumbnail title={notebook.title} />

        <div className="notebook-card__body">
          <div className="notebook-card__meta">
            <h3 className="notebook-card__title">{notebook.title}</h3>
            <NotebookAccessBadge access={notebook.access} />
          </div>

          <p className="notebook-card__description">{notebook.description}</p>
        </div>
      </button>

      <div className="notebook-card__footer">
        <p className="notebook-card__page-count">{pageLabel}</p>
        <NotebookCardInfo notebook={notebook} />
      </div>
    </div>
  );
}
