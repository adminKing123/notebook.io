export const ROUTES = {
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  CREATE_NOTEBOOK: '/create-notebook',
  NOTEBOOK: '/notebook/:id',
};

export function notebookRoute(id) {
  return `/notebook/${id}`;
}
