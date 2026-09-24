import AppBrand from '../../brand/AppBrand';
import AppProfileMenu from './AppProfileMenu';
import './navbar.css';

export default function AppNavbar() {
  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <AppBrand variant="navbar" />
        <AppProfileMenu />
      </div>
    </header>
  );
}
