import { MdAdd } from 'react-icons/md';

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
          <h3 className="notebook-card__title">Create New Notebook</h3>
          <span className="notebook-card__meta-spacer" aria-hidden="true" />
        </div>

        <p className="notebook-card__description">
          Start a fresh notebook for your thoughts and ideas.
        </p>
      </div>

      <div className="notebook-card__footer">
        <p className="notebook-card__page-count notebook-card__page-count--muted">New</p>
        <span className="notebook-card__footer-spacer" aria-hidden="true" />
      </div>
    </button>
  );
}
