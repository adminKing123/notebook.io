import { useAuth } from '../auth/AuthContext';
import Button from '../components/ui/Button';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <section className="dashboard">
      <div className="dashboard__card">
        <p className="dashboard__brand">Personal Diary</p>
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__welcome">
          Welcome, <strong>{user?.full_name}</strong>
        </p>
        <Button onClick={logout}>Sign Out</Button>
      </div>
    </section>
  );
}
