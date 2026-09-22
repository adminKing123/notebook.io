import { OTP_LENGTH } from './constants';

export function validateEmail(formData) {
  if (!formData.email.trim()) {
    return 'Email address is required.';
  }

  return '';
}

export function validatePassword(formData) {
  if (!formData.password) {
    return 'Password is required.';
  }

  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.';
  }

  return '';
}

export function validateOtp(formData) {
  const otpPattern = new RegExp(`^\\d{${OTP_LENGTH}}$`);

  if (!otpPattern.test(formData.otp)) {
    return 'Enter the 6-digit verification code.';
  }

  return '';
}
