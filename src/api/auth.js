import { apiRequest } from './client';

export function signUp(payload) {
  return apiRequest('/auth/sign-up/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      full_name: payload.fullName,
      age: Number(payload.age),
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirmPassword,
    }),
  });
}

export function verifySignUp({ email, otp }) {
  return apiRequest('/auth/sign-up/verify/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, otp }),
  });
}

export function resendSignUpOtp({ email }) {
  return apiRequest('/auth/sign-up/resend-otp/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email }),
  });
}

export function login({ email, password }) {
  return apiRequest('/auth/login/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });
}

export function fetchCurrentUser() {
  return apiRequest('/auth/me/');
}

export function requestPasswordReset({ email }) {
  return apiRequest('/auth/forgot-password/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordResetOtp({ email, otp }) {
  return apiRequest('/auth/forgot-password/verify/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, otp }),
  });
}

export function resendPasswordResetOtp({ email }) {
  return apiRequest('/auth/forgot-password/resend-otp/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(payload) {
  return apiRequest('/auth/forgot-password/reset/', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      email: payload.email,
      otp: payload.otp,
      password: payload.password,
      confirm_password: payload.confirmPassword,
    }),
  });
}
