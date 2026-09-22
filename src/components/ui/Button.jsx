import './forms.css';

export default function Button({
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
