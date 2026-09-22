import { Link } from 'react-router-dom';

export default function AuthInlineLink({
  children,
  to,
  onClick,
  disabled = false,
  className = 'auth__inline-link',
}) {
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
