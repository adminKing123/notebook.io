export const SIGN_UP_STEPS = {
  PROFILE: 0,
  PASSWORD: 1,
  OTP: 2,
};

export const SIGN_UP_STEP_COUNT = 3;

export const SIGN_UP_STEP_LABELS = ['Profile', 'Password', 'Verify'];

export const INITIAL_SIGN_UP_FORM = {
  fullName: '',
  dateOfBirth: '',
  email: '',
  password: '',
  confirmPassword: '',
  otp: '',
};

export const SIGN_UP_STEP_CONTENT = {
  [SIGN_UP_STEPS.PROFILE]: {
    title: 'Create your account',
    description: 'Tell us a little about yourself to get started.',
  },
  [SIGN_UP_STEPS.PASSWORD]: {
    title: 'Secure your account',
    description: 'Choose a strong password to protect your diary.',
  },
  [SIGN_UP_STEPS.OTP]: {
    title: 'Verify your email',
    description: 'Enter the code we sent to confirm your email address.',
  },
};
