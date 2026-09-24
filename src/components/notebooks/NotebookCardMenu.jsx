import { useState } from 'react';
import { MdDeleteOutline, MdEdit, MdMoreVert } from 'react-icons/md';
import { deleteNotebook } from '../../api/notebooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/Dialog';
import NotebookEditDialog from './NotebookEditDialog';

export default function NotebookCardMenu({ notebook, onDeleted, onUpdated }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteNotebook(notebook.id);
      setIsDeleteOpen(false);
      onDeleted?.(notebook.id);
    } catch (requestError) {
      setDeleteError(requestError.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="notebook-card-menu__trigger"
            aria-label={`Options for ${notebook.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <MdMoreVert aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="notebook-card-menu__dropdown"
          side="top"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuItem
            className="notebook-card-menu__item"
            onSelect={() => setIsEditOpen(true)}
          >
            <span className="notebook-card-menu__item-content">
              <MdEdit className="notebook-card-menu__item-icon" aria-hidden="true" />
              View/Edit Details
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="notebook-card-menu__item notebook-card-menu__item--danger"
            onSelect={() => {
              setDeleteError('');
              setIsDeleteOpen(true);
            }}
          >
            <span className="notebook-card-menu__item-content">
              <MdDeleteOutline className="notebook-card-menu__item-icon" aria-hidden="true" />
              Delete notebook
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotebookEditDialog
        notebook={notebook}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdated={onUpdated}
      />

      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteOpen(open);
          }
        }}
      >
        <DialogContent className="notebook-delete-dialog" showCloseButton={!isDeleting}>
          <DialogTitle className="notebook-delete-dialog__title">Delete notebook?</DialogTitle>
          <DialogDescription className="notebook-delete-dialog__description">
            This will permanently delete <strong>{notebook.title}</strong> and all of its pages.
            This action cannot be undone.
          </DialogDescription>

          {deleteError && (
            <p className="notebook-delete-dialog__error" role="alert">
              {deleteError}
            </p>
          )}

          <div className="notebook-delete-dialog__actions">
            <button
              type="button"
              className="notebook-delete-dialog__button notebook-delete-dialog__button--secondary"
              disabled={isDeleting}
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="notebook-delete-dialog__button notebook-delete-dialog__button--danger"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
