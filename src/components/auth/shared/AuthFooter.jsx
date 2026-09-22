import AuthInlineLink from './AuthInlineLink';

export default function AuthFooter({ text, linkLabel, to }) {
  return (
    <p className="auth__footer">
      {text}{' '}
      <AuthInlineLink to={to} className="auth__footer-link">
        {linkLabel}
      </AuthInlineLink>
    </p>
  );
}
