export const FORGOT_PASSWORD_STEPS = {
  EMAIL: 0,
  OTP: 1,
  PASSWORD: 2,
};

export const FORGOT_PASSWORD_STEP_COUNT = 3;

export const FORGOT_PASSWORD_STEP_LABELS = ['Email', 'Verify', 'Reset'];

export const INITIAL_FORGOT_PASSWORD_FORM = {
  email: '',
  otp: '',
  password: '',
  confirmPassword: '',
};
