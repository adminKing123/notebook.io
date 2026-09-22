import { MdZoomIn, MdZoomOut } from 'react-icons/md';

export default function NotebookZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  canZoomIn,
  canZoomOut,
}) {
  return (
    <>
      <button
        type="button"
        className="notebook__config-button"
        title="Zoom out"
        onClick={onZoomOut}
        disabled={!canZoomOut}
      >
        <MdZoomOut />
      </button>

      <span className="notebook__config-zoom-label">{Math.round(zoom * 100)}%</span>

      <button
        type="button"
        className="notebook__config-button"
        title="Zoom in"
        onClick={onZoomIn}
        disabled={!canZoomIn}
      >
        <MdZoomIn />
      </button>
    </>
  );
}
