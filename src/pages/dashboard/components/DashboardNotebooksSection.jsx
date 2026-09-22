import NotebookCardsGrid from '../../../components/notebooks/NotebookCardsGrid';
import { NOTEBOOKS_SECTION, RECENT_NOTEBOOKS } from '../constants';
import './dashboard-notebooks.css';

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

        <NotebookCardsGrid notebooks={RECENT_NOTEBOOKS} />
      </div>
    </section>
  );
}
