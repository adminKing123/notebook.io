import { apiRequest } from './client';

export async function fetchUserImages({ page = 1, pageSize = 24 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  return apiRequest(`/notebooks/images/?${params.toString()}`);
}
