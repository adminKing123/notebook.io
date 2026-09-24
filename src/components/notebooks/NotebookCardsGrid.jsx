import CreateNotebookCard from './CreateNotebookCard';
import NotebookCard from './NotebookCard';
import './notebooks.css';

export default function NotebookCardsGrid({
  notebooks,
  onNotebookDeleted,
  onNotebookUpdated,
}) {
  return (
    <div className="notebook-cards-grid">
      <CreateNotebookCard />
      {notebooks.map((notebook) => (
        <NotebookCard
          key={notebook.id}
          notebook={notebook}
          onNotebookDeleted={onNotebookDeleted}
          onNotebookUpdated={onNotebookUpdated}
        />
      ))}
    </div>
  );
}
