import { useRef, useState } from 'react';
import {
  MdAdd,
  MdChevronRight,
  MdDeleteOutline,
  MdImage,
  MdMenuBook,
  MdMoreVert,
  MdRemove,
  MdUpload,
} from 'react-icons/md';
import { MAX_PAGE_IMAGE_IMPORT } from '../../../pages/notebook/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/DropdownMenu';
import UploadedImagesPickerDialog from './UploadedImagesPickerDialog';

function MenuItemContent({ icon: Icon, children }) {
  return (
    <span className="notebook-config__menu-item-content">
      <Icon className="notebook-config__menu-item-icon" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}

function SubmenuTriggerContent({ icon: Icon, children }) {
  return (
    <span className="notebook-config__submenu-trigger-content">
      <span className="notebook-config__menu-item-content">
        <Icon className="notebook-config__menu-item-icon" aria-hidden="true" />
        <span>{children}</span>
      </span>
      <MdChevronRight className="notebook-config__submenu-chevron" aria-hidden="true" />
    </span>
  );
}

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
  const imageInputRef = useRef(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleImageInputChange = (event) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_PAGE_IMAGE_IMPORT);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        onImportImage(file);
      }
    });

    event.target.value = '';
  };

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
          <div className="notebook-config__menu-zoom" role="group" aria-label="Scale">
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
            <DropdownMenuSubTrigger className="notebook-config__submenu-trigger">
              <SubmenuTriggerContent icon={MdMenuBook}>Page</SubmenuTriggerContent>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="notebook-config__menu notebook-config__submenu">
              <DropdownMenuItem className="notebook-config__menu-item" onSelect={onAddPage}>
                <MenuItemContent icon={MdAdd}>Add page</MenuItemContent>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="notebook-config__menu-item notebook-config__menu-item--danger"
                disabled={!canRemovePage}
                onSelect={onRemovePage}
              >
                <MenuItemContent icon={MdDeleteOutline}>Remove page</MenuItemContent>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="notebook-config__submenu-trigger">
              <SubmenuTriggerContent icon={MdImage}>Image</SubmenuTriggerContent>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="notebook-config__menu notebook-config__submenu">
              <DropdownMenuItem
                className="notebook-config__menu-item"
                onSelect={() => imageInputRef.current?.click()}
              >
                <MenuItemContent icon={MdUpload}>Import from device</MenuItemContent>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="notebook-config__menu-item"
                onSelect={() => setIsPickerOpen(true)}
              >
                <MenuItemContent icon={MdImage}>Use uploaded images</MenuItemContent>
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
        maxSelection={MAX_PAGE_IMAGE_IMPORT}
      />
    </>
  );
}
