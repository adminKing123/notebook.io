import { MdChevronRight } from 'react-icons/md';

export function ConfigMenuItemContent({ icon: Icon, children }) {
  return (
    <span className="notebook-config__menu-item-content">
      <Icon className="notebook-config__menu-item-icon" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}

export function ConfigSubmenuTriggerContent({ icon: Icon, children }) {
  return (
    <span className="notebook-config__submenu-trigger-content">
      <ConfigMenuItemContent icon={Icon}>{children}</ConfigMenuItemContent>
      <MdChevronRight className="notebook-config__submenu-chevron" aria-hidden="true" />
    </span>
  );
}
