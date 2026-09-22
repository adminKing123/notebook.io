import { APP_BRAND } from '../constants';
import AppProfileMenu from './AppProfileMenu';
import './navbar.css';

export default function AppNavbar() {
  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <div className="app-navbar__brand">
          <span className="app-navbar__brand-mark" aria-hidden="true" />
          <span className="app-navbar__brand-text">{APP_BRAND}</span>
        </div>
        <AppProfileMenu />
      </div>
    </header>
  );
}
