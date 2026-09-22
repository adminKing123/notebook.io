import { MdAdd } from 'react-icons/md';
import { CREATE_NOTEBOOK_CARD } from '../../constants';
import NotebookCardFooter from './NotebookCardFooter';

export default function CreateNotebookCard() {
  return (
    <button type="button" className="notebook-card notebook-card--create">
      <div className="notebook-card__thumbnail">
        <div className="notebook-card__thumbnail-sheet notebook-card__thumbnail-sheet--create">
          <span className="notebook-card__create-icon" aria-hidden="true">
            <MdAdd />
          </span>
        </div>
      </div>

      <div className="notebook-card__body">
        <div className="notebook-card__meta">
          <h3 className="notebook-card__title">{CREATE_NOTEBOOK_CARD.title}</h3>
          <span className="notebook-card__meta-spacer" aria-hidden="true" />
        </div>

        <p className="notebook-card__description">{CREATE_NOTEBOOK_CARD.description}</p>
      </div>

      <NotebookCardFooter label={CREATE_NOTEBOOK_CARD.footerLabel} muted />
    </button>
  );
}
