import CreateNotebookCard from './CreateNotebookCard';
import NotebookCard from './NotebookCard';
import './notebooks.css';

export default function NotebookCardsGrid({ notebooks }) {
  return (
    <div className="notebook-cards-grid">
      <CreateNotebookCard />
      {notebooks.map((notebook) => (
        <NotebookCard key={notebook.id} notebook={notebook} />
      ))}
    </div>
  );
}
