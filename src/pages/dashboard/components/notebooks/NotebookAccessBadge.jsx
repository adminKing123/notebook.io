import { NOTEBOOK_ACCESS_LABELS } from '../../constants';

export default function NotebookAccessBadge({ access }) {
  return (
    <span className={`notebook-access-badge notebook-access-badge--${access}`}>
      {NOTEBOOK_ACCESS_LABELS[access]}
    </span>
  );
}
