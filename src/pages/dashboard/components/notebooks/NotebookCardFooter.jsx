export default function NotebookCardFooter({ label, muted = false, action = null }) {
  const pageCountClassName = muted
    ? 'notebook-card__page-count notebook-card__page-count--muted'
    : 'notebook-card__page-count';

  return (
    <div className="notebook-card__footer">
      <p className={pageCountClassName}>{label}</p>
      {action ?? <span className="notebook-card__footer-spacer" aria-hidden="true" />}
    </div>
  );
}
