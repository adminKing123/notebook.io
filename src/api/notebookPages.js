import { apiRequest } from './client';

export async function fetchUserImages({ page = 1, pageSize = 24 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  return apiRequest(`/notebooks/images/?${params.toString()}`);
}

export async function fetchPageWindow(notebookId, { center = 1, window = 5 } = {}) {
  const params = new URLSearchParams({
    center: String(center),
    window: String(window),
  });

  return apiRequest(`/notebooks/${notebookId}/pages/?${params.toString()}`);
}

export async function saveNotebookPage(notebookId, pageId, payload) {
  return apiRequest(`/notebooks/${notebookId}/pages/${pageId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function createNotebookPage(notebookId) {
  return apiRequest(`/notebooks/${notebookId}/pages/`, {
    method: 'POST',
  });
}

export async function deleteNotebookPage(notebookId, pageId) {
  return apiRequest(`/notebooks/${notebookId}/pages/${pageId}/`, {
    method: 'DELETE',
  });
}

export async function uploadNotebookPageImage(notebookId, pageId, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  return apiRequest(`/notebooks/${notebookId}/pages/${pageId}/images/`, {
    method: 'POST',
    body: formData,
  });
}
