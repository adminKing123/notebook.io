import { useRef, useState } from 'react';
import { MdHighlightOff, MdImage } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/DropdownMenu';
import UploadedImagesPickerDialog from './UploadedImagesPickerDialog';
import './notebook-image-controls.css';

const MAX_IMPORT_COUNT = 5;

export default function NotebookImageControls({
  onImportImage,
  onImportExistingImages,
  onDeleteSelectedImage,
  canDeleteSelectedImage,
}) {
  const imageInputRef = useRef(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleImageInputChange = (event) => {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_IMPORT_COUNT);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        onImportImage(file);
      }
    });

    event.target.value = '';
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="notebook__config-button"
            title="Import image"
            aria-label="Import image"
          >
            <MdImage />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="notebook-image-menu"
          side="top"
          align="center"
          sideOffset={10}
        >
          <DropdownMenuItem
            className="notebook-image-menu__item"
            onSelect={() => imageInputRef.current?.click()}
          >
            Import from device
          </DropdownMenuItem>
          <DropdownMenuItem
            className="notebook-image-menu__item"
            onSelect={() => setIsPickerOpen(true)}
          >
            Use uploaded images
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="notebook__config-file-input"
        onChange={handleImageInputChange}
      />

      <UploadedImagesPickerDialog
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onImport={(images) => onImportExistingImages?.(images)}
        maxSelection={MAX_IMPORT_COUNT}
      />

      <button
        type="button"
        className="notebook__config-button notebook__config-button--danger"
        title="Delete selected image"
        onClick={onDeleteSelectedImage}
        disabled={!canDeleteSelectedImage}
      >
        <MdHighlightOff />
      </button>
    </>
  );
}
