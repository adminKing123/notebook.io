import { useRef } from 'react';
import { OTP_LENGTH } from './constants';

export default function OtpInput({ value, onChange }) {
  const inputRefs = useRef([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? '');

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const updateDigit = (index, digit) => {
    const sanitized = digit.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitized;
    onChange(nextDigits.join(''));

    if (sanitized && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(pasted.slice(0, OTP_LENGTH));

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    focusInput(focusIndex);
  };

  return (
    <div className="auth__otp" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          className="auth__otp-input"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
        />
      ))}
    </div>
  );
}
