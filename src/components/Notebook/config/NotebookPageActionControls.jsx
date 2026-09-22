import { MdAdd, MdDeleteOutline } from 'react-icons/md';

export default function NotebookPageActionControls({
  onAddPage,
  onRemovePage,
  canRemovePage,
}) {
  return (
    <>
      <button
        type="button"
        className="notebook__config-button"
        title="Add new page"
        onClick={onAddPage}
      >
        <MdAdd />
      </button>

      <button
        type="button"
        className="notebook__config-button notebook__config-button--danger"
        title="Remove this page"
        onClick={onRemovePage}
        disabled={!canRemovePage}
      >
        <MdDeleteOutline />
      </button>
    </>
  );
}
