import { RECENT_NOTEBOOKS } from '../../constants';
import CreateNotebookCard from './CreateNotebookCard';
import NotebookCard from './NotebookCard';
import './notebooks.css';

export default function NotebookCardsGrid() {
  return (
    <div className="notebook-cards-grid">
      <CreateNotebookCard />
      {RECENT_NOTEBOOKS.map((notebook) => (
        <NotebookCard key={notebook.id} notebook={notebook} />
      ))}
    </div>
  );
}
