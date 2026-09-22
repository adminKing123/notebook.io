import { TooltipProvider } from '../../components/ui/Tooltip';
import AppLayout from '../../components/layout/AppLayout';
import DashboardNotebooksSection from './components/DashboardNotebooksSection';

export default function DashboardPage() {
  return (
    <TooltipProvider>
      <AppLayout>
        <DashboardNotebooksSection />
      </AppLayout>
    </TooltipProvider>
  );
}
