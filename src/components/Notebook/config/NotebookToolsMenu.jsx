import {
  MdAdd,
  MdDeleteOutline,
  MdImage,
  MdMenuBook,
  MdMoreVert,
  MdRemove,
  MdUpload,
} from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/DropdownMenu';
import { ConfigMenuItemContent, ConfigSubmenuTriggerContent } from './ConfigMenuParts';
import { useNotebookImageImport } from './hooks/useNotebookImageImport';
import UploadedImagesPickerDialog from './UploadedImagesPickerDialog';

export default function NotebookToolsMenu({
  zoom,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
  onAddPage,
  onRemovePage,
  canRemovePage,
  onImportImage,
  onImportExistingImages,
}) {
  const {
    imageInputRef,
    isPickerOpen,
    setIsPickerOpen,
    handleImageInputChange,
    openFilePicker,
    maxSelection,
  } = useNotebookImageImport(onImportImage);

  const handleZoomOutClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (canZoomOut) {
      onZoomOut();
    }
  };

  const handleZoomInClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (canZoomIn) {
      onZoomIn();
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="notebook-config__menu-trigger"
            title="Notebook tools"
            aria-label="Notebook tools"
          >
            <MdMoreVert className="notebook-config__menu-trigger-icon" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="notebook-config__menu"
          side="top"
          align="end"
          sideOffset={10}
        >
          <div className="notebook-config__menu-zoom" role="group" aria-label="Scale and zoom">
            <span className="notebook-config__menu-zoom-label">Scale / Zoom</span>
            <div className="notebook-config__menu-zoom-controls">
              <button
                type="button"
                className="notebook-config__menu-zoom-btn"
                aria-label="Zoom out"
                disabled={!canZoomOut}
                onPointerDown={handleZoomOutClick}
              >
                <MdRemove aria-hidden="true" />
              </button>
              <span className="notebook-config__menu-zoom-value">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="notebook-config__menu-zoom-btn"
                aria-label="Zoom in"
                disabled={!canZoomIn}
                onPointerDown={handleZoomInClick}
              >
                <MdAdd aria-hidden="true" />
              </button>
            </div>
          </div>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="notebook-config__menu-row notebook-config__submenu-trigger">
              <ConfigSubmenuTriggerContent icon={MdMenuBook}>Page</ConfigSubmenuTriggerContent>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="notebook-config__menu notebook-config__submenu">
              <DropdownMenuItem className="notebook-config__menu-row notebook-config__menu-item" onSelect={onAddPage}>
                <ConfigMenuItemContent icon={MdAdd}>Add page</ConfigMenuItemContent>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="notebook-config__menu-row notebook-config__menu-item notebook-config__menu-item--danger"
                disabled={!canRemovePage}
                onSelect={onRemovePage}
              >
                <ConfigMenuItemContent icon={MdDeleteOutline}>Remove page</ConfigMenuItemContent>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="notebook-config__menu-row notebook-config__submenu-trigger">
              <ConfigSubmenuTriggerContent icon={MdImage}>Image</ConfigSubmenuTriggerContent>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="notebook-config__menu notebook-config__submenu">
              <DropdownMenuItem
                className="notebook-config__menu-row notebook-config__menu-item"
                onSelect={openFilePicker}
              >
                <ConfigMenuItemContent icon={MdUpload}>Import from device</ConfigMenuItemContent>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="notebook-config__menu-row notebook-config__menu-item"
                onSelect={() => setIsPickerOpen(true)}
              >
                <ConfigMenuItemContent icon={MdImage}>Use uploaded images</ConfigMenuItemContent>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="notebook-config__file-input"
        onChange={handleImageInputChange}
      />

      <UploadedImagesPickerDialog
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onImport={(images) => onImportExistingImages?.(images)}
        maxSelection={maxSelection}
      />
    </>
  );
}
