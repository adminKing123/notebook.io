import { Fragment } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/DropdownMenu';
import { PROFILE_MENU_SECTIONS } from '../constants';
import ProfileAvatar from './ProfileAvatar';
import './profile-menu.css';

export default function AppProfileMenu() {
  const { user, logout } = useAuth();

  const handleMenuItemClick = (item) => {
    if (item.id === 'logout') {
      logout();
    }
  };

  return (
    <DropdownMenu modal={false}>
      <div className="app-profile-menu">
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="app-profile-menu__trigger"
            aria-label="Open profile menu"
          >
            <ProfileAvatar fullName={user?.full_name} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="app-profile-menu__dropdown"
          sideOffset={8}
          align="end"
        >
          <div className="app-profile-menu__header">
            <ProfileAvatar fullName={user?.full_name} size="large" />
            <div className="app-profile-menu__identity">
              <p className="app-profile-menu__name">{user?.full_name || 'User'}</p>
              <p className="app-profile-menu__email">{user?.email || ''}</p>
            </div>
          </div>

          <div className="app-profile-menu__list">
            {PROFILE_MENU_SECTIONS.map((section, sectionIndex) => (
              <Fragment key={sectionIndex}>
                {sectionIndex > 0 && (
                  <DropdownMenuSeparator className="app-profile-menu__divider-line" />
                )}
                {section.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className={
                      item.variant === 'logout'
                        ? 'app-profile-menu__item app-profile-menu__item--logout'
                        : 'app-profile-menu__item'
                    }
                    onSelect={() => handleMenuItemClick(item)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </Fragment>
            ))}
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
