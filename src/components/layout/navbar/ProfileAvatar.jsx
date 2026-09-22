function getInitial(fullName) {
  const trimmed = fullName?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export default function ProfileAvatar({ fullName, size = 'default' }) {
  const className =
    size === 'large'
      ? 'app-profile-menu__avatar app-profile-menu__avatar--large'
      : 'app-profile-menu__avatar';

  return (
    <span className={className} aria-hidden="true">
      {getInitial(fullName)}
    </span>
  );
}
