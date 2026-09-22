import { NOTEBOOKS_SECTION } from '../constants';
import NotebookCardsGrid from './notebooks/NotebookCardsGrid';

export default function DashboardNotebooksSection() {
  return (
    <section className="dashboard-notebooks">
      <div className="dashboard-notebooks__inner">
        <header className="dashboard-notebooks__header">
          <h1 className="dashboard-notebooks__title">{NOTEBOOKS_SECTION.title}</h1>
          <p className="dashboard-notebooks__description">
            {NOTEBOOKS_SECTION.description}
          </p>
        </header>

        <NotebookCardsGrid />
      </div>
    </section>
  );
}
