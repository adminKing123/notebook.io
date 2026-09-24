import { MdInfoOutline } from 'react-icons/md';
import Tooltip from '../ui/Tooltip';
import { NOTEBOOK_INFO_FIELDS } from './constants';
import { formatNotebookDateTime } from '../../utils/notebookDisplay';

function getInfoFieldValue(notebook, field) {
  const value = notebook[field.key];

  if (field.type === 'datetime') {
    return formatNotebookDateTime(value);
  }

  return value;
}

function NotebookCardInfoContent({ notebook }) {
  return (
    <>
      <dl className="notebook-card-info__details">
        {NOTEBOOK_INFO_FIELDS.map((field) => (
          <div key={field.id} className="notebook-card-info__detail">
            <dt>{field.label}</dt>
            <dd>{getInfoFieldValue(notebook, field)}</dd>
          </div>
        ))}
      </dl>

      <div className="notebook-card-info__description">
        <p className="notebook-card-info__description-label">Description</p>
        <p className="notebook-card-info__description-text">{notebook.description}</p>
      </div>
    </>
  );
}

export default function NotebookCardInfo({ notebook }) {
  return (
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
      >
        <MdInfoOutline aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
