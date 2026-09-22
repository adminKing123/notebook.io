import { formatPageCount } from '../../utils/notebookDisplay';
import NotebookAccessBadge from './NotebookAccessBadge';
import NotebookCardFooter from './NotebookCardFooter';
import NotebookCardInfo from './NotebookCardInfo';
import NotebookCardThumbnail from './NotebookCardThumbnail';

export default function NotebookCard({ notebook }) {
  return (
    <div className="notebook-card">
      <button type="button" className="notebook-card__main">
        <NotebookCardThumbnail imageSrc={notebook.thumbnailUrl} />

        <div className="notebook-card__body">
          <div className="notebook-card__meta">
            <h3 className="notebook-card__title">{notebook.title}</h3>
            <NotebookAccessBadge access={notebook.access} />
          </div>

          <p className="notebook-card__description">{notebook.description}</p>
        </div>
      </button>

      <NotebookCardFooter
        label={formatPageCount(notebook.pageCount)}
        action={<NotebookCardInfo notebook={notebook} />}
      />
    </div>
  );
}
