export default function NotebookZoomShell({
  zoom,
  zoomContentRef,
  shellHeight,
  children,
}) {
  return (
    <div
      className="notebook__zoom-shell"
      style={shellHeight ? { height: shellHeight } : undefined}
    >
      <div
        ref={zoomContentRef}
        className="notebook__zoom-content"
        style={{ transform: `scale(${zoom})` }}
      >
        {children}
      </div>
    </div>
  );
}
