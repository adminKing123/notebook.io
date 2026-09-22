export default function AuthFormMessage({ message, variant = 'error' }) {
  if (!message) {
    return null;
  }

  return (
    <p className={`auth__form-message auth__form-message--${variant}`} role="alert">
      {message}
    </p>
  );
}
