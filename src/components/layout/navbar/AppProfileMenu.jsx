import { Fragment } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { useDropdownMenu } from '../hooks/useDropdownMenu';
import { PROFILE_MENU_SECTIONS } from '../constants';
import ProfileAvatar from './ProfileAvatar';
import './profile-menu.css';

export default function AppProfileMenu() {
  const { user, logout } = useAuth();
  const { isOpen, containerRef, toggle, close } = useDropdownMenu();

  const handleMenuItemClick = (item) => {
    if (item.id === 'logout') {
      logout();
    }

    close();
  };

  return (
    <div className="app-profile-menu" ref={containerRef}>
      <button
        type="button"
        className="app-profile-menu__trigger"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggle}
      >
        <ProfileAvatar fullName={user?.full_name} />
      </button>

      {isOpen && (
        <div className="app-profile-menu__dropdown" role="menu">
          <div className="app-profile-menu__header">
            <ProfileAvatar fullName={user?.full_name} size="large" />
            <div className="app-profile-menu__identity">
              <p className="app-profile-menu__name">{user?.full_name || 'User'}</p>
              <p className="app-profile-menu__email">{user?.email || ''}</p>
            </div>
          </div>

          <ul className="app-profile-menu__list">
            {PROFILE_MENU_SECTIONS.map((section, sectionIndex) => (
              <Fragment key={sectionIndex}>
                {sectionIndex > 0 && (
                  <li className="app-profile-menu__divider" role="separator" />
                )}
                {section.map((item) => (
                  <li key={item.id} role="none">
                    <button
                      type="button"
                      className={`app-profile-menu__item${
                        item.variant === 'logout' ? ' app-profile-menu__item--logout' : ''
                      }`}
                      role="menuitem"
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
