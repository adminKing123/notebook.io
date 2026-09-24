import Spinner from '../../../components/ui/Spinner';
import NotebookCardsGrid from '../../../components/notebooks/NotebookCardsGrid';
import { NOTEBOOKS_SECTION } from '../constants';
import { useRecentNotebooks } from '../hooks/useRecentNotebooks';
import './dashboard-notebooks.css';

export default function DashboardNotebooksSection() {
  const { notebooks, isLoading, error, removeNotebook, replaceNotebook } =
    useRecentNotebooks();

  return (
    <section className="dashboard-notebooks">
      <div className="dashboard-notebooks__inner">
        <header className="dashboard-notebooks__header">
          <h1 className="dashboard-notebooks__title">{NOTEBOOKS_SECTION.title}</h1>
          <p className="dashboard-notebooks__description">
            {NOTEBOOKS_SECTION.description}
          </p>
        </header>

        {isLoading && (
          <Spinner
            size="md"
            centered
            centerLayout="ui-spinner-center--section"
            label="Loading recent notebooks"
          />
        )}

        {!isLoading && error && (
          <p className="dashboard-notebooks__status dashboard-notebooks__status--error">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <NotebookCardsGrid
            notebooks={notebooks}
            onNotebookDeleted={removeNotebook}
            onNotebookUpdated={replaceNotebook}
          />
        )}
      </div>
    </section>
  );
}
