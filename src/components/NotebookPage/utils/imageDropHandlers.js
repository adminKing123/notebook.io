export function handleSheetDragOverCapture(event) {
  if (event.dataTransfer.types.includes('Files')) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }
}

export function handleSheetDropCapture(event, onImportImage) {
  const file = event.dataTransfer.files?.[0];
  if (file?.type.startsWith('image/')) {
    event.preventDefault();
    onImportImage?.(file);
  }
}
