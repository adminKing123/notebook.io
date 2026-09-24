import { Link } from 'react-router-dom';
import { notebookRoute } from '../../routes';
import { formatPageCount } from '../../utils/notebookDisplay';
import NotebookAccessBadge from './NotebookAccessBadge';
import NotebookCardFooter from './NotebookCardFooter';
import NotebookCardMenu from './NotebookCardMenu';
import NotebookCardThumbnail from './NotebookCardThumbnail';

export default function NotebookCard({ notebook, onNotebookDeleted, onNotebookUpdated }) {
  return (
    <div className="notebook-card">
      <Link to={notebookRoute(notebook.id)} className="notebook-card__main">
        <NotebookCardThumbnail imageSrc={notebook.thumbnailUrl} />

        <div className="notebook-card__body">
          <div className="notebook-card__meta">
            <h3 className="notebook-card__title">{notebook.title}</h3>
            <NotebookAccessBadge access={notebook.access} />
          </div>

          <p className="notebook-card__description">{notebook.description}</p>
        </div>
      </Link>

      <NotebookCardFooter
        label={formatPageCount(notebook.pageCount)}
        action={
          <NotebookCardMenu
            notebook={notebook}
            onDeleted={onNotebookDeleted}
            onUpdated={onNotebookUpdated}
          />
        }
      />
    </div>
  );
}
