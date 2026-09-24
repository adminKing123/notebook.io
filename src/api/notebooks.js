import { apiRequest } from './client';

function mapNotebook(notebook) {
  return {
    id: notebook.id,
    title: notebook.title,
    description: notebook.description,
    pageCount: notebook.page_count,
    access: notebook.access,
    thumbnailUrl: notebook.thumbnail_url,
  };
}

export async function fetchRecentNotebooks() {
  const data = await apiRequest('/notebooks/recent/');
  return Array.isArray(data) ? data.map(mapNotebook) : [];
}

export async function createNotebook({ title, description, access, thumbnailFile }) {
  const formData = new FormData();
  formData.append('title', title.trim());
  formData.append('description', description.trim());
  formData.append('access', access);

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  const data = await apiRequest('/notebooks/', {
    method: 'POST',
    body: formData,
  });

  return mapNotebook(data);
}

export async function deleteNotebook(notebookId) {
  return apiRequest(`/notebooks/${notebookId}/`, {
    method: 'DELETE',
  });
}

export async function updateNotebook(
  notebookId,
  { title, description, access, thumbnailFile, clearThumbnail },
) {
  const formData = new FormData();

  formData.append('title', title.trim());
  formData.append('description', description.trim());
  formData.append('access', access);

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  if (clearThumbnail) {
    formData.append('clear_thumbnail', 'true');
  }

  const data = await apiRequest(`/notebooks/${notebookId}/`, {
    method: 'PATCH',
    body: formData,
  });

  return mapNotebook(data);
}
