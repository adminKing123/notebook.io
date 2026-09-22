import { MdInfoOutline } from 'react-icons/md';
import Tooltip from '../../../../components/ui/Tooltip';
import { formatNotebookDateTime } from '../../utils/formatNotebookDateTime';

function NotebookCardInfoContent({ notebook }) {
  const fullDescription = notebook.fullDescription ?? notebook.description;

  return (
    <>
      <dl className="notebook-card-info__details">
        <div className="notebook-card-info__detail">
          <dt>Created</dt>
          <dd>{formatNotebookDateTime(notebook.createdAt)}</dd>
        </div>
        <div className="notebook-card-info__detail">
          <dt>Last updated</dt>
          <dd>{formatNotebookDateTime(notebook.lastUpdatedAt)}</dd>
        </div>
        <div className="notebook-card-info__detail">
          <dt>Owned by</dt>
          <dd>{notebook.ownedBy}</dd>
        </div>
      </dl>

      <div className="notebook-card-info__description">
        <p className="notebook-card-info__description-label">Description</p>
        <p className="notebook-card-info__description-text">{fullDescription}</p>
      </div>
    </>
  );
}

export default function NotebookCardInfo({ notebook }) {
  return (
    <div className="notebook-card-info">
      <Tooltip
        content={<NotebookCardInfoContent notebook={notebook} />}
        contentClassName="notebook-card-info__tooltip"
        side="top"
        align="end"
      >
        <button
          type="button"
          className="notebook-card-info__trigger"
          aria-label={`More details about ${notebook.title}`}
          onClick={(event) => event.stopPropagation()}
        >
          <MdInfoOutline aria-hidden="true" />
        </button>
      </Tooltip>
    </div>
  );
}
