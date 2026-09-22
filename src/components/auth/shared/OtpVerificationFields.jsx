import AuthInlineLink from './AuthInlineLink';
import OtpInput from './OtpInput';

export default function OtpVerificationFields({
  email,
  otp,
  onOtpChange,
  onResend,
  isResending = false,
}) {
  return (
    <>
      <p className="auth__otp-message">
        We sent a 6-digit verification code to{' '}
        <strong>{email || 'your email address'}</strong>.
      </p>

      <div className="auth__otp-field">
        <span className="auth__otp-label">Verification code</span>
        <OtpInput value={otp} onChange={onOtpChange} />
      </div>

      <AuthInlineLink onClick={onResend} disabled={isResending}>
        {isResending ? 'Sending code...' : "Didn't receive a code? Resend"}
      </AuthInlineLink>
    </>
  );
}
