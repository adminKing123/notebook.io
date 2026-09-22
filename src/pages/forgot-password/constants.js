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

export const FORGOT_PASSWORD_STEP_CONTENT = {
  [FORGOT_PASSWORD_STEPS.EMAIL]: {
    title: 'Reset your password',
    description: 'Enter the email address linked to your account.',
  },
  [FORGOT_PASSWORD_STEPS.OTP]: {
    title: 'Verify your email',
    description: 'Enter the code we sent to verify it is really you.',
  },
  [FORGOT_PASSWORD_STEPS.PASSWORD]: {
    title: 'Create a new password',
    description: 'Choose a new password for your account.',
  },
};
