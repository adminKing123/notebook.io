import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ROUTES } from '../../routes';

export default function AuthRoute({ children, requireAuth }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p className="route-loading">Loading...</p>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
