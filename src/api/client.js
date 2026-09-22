import { getAccessToken } from '../auth/tokenStorage';
import { API_BASE_URL } from '../config';

class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const { skipAuth = false, headers: customHeaders, ...fetchOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(customHeaders ?? {}),
  };

  if (!skipAuth) {
    const token = getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  let data = null;

  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(parseApiErrorMessage(data), {
      status: response.status,
      data,
    });
  }

  return data;
}

function parseApiErrorMessage(data) {
  if (!data) {
    return 'Something went wrong. Please try again.';
  }

  if (typeof data.detail === 'string') {
    return data.detail;
  }

  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0];
  }

  const firstField = Object.keys(data)[0];
  if (firstField && Array.isArray(data[firstField])) {
    return data[firstField][0];
  }

  return 'Something went wrong. Please try again.';
}
