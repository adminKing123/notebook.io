import AppNavbar from './navbar/AppNavbar';
import './app-layout.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <AppNavbar />
      <main className="app-layout__main">{children}</main>
    </div>
  );
}
