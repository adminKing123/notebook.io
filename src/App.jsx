import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AuthRoute from './components/auth/AuthRoute';
import { TooltipProvider } from './components/ui/Tooltip';
import DashboardPage from './pages/dashboard/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { ROUTES } from './routes';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <main className="home">
          <Routes>
            <Route
              path={ROUTES.LOGIN}
              element={
                <AuthRoute requireAuth={false}>
                  <LoginPage />
                </AuthRoute>
              }
            />
            <Route
              path={ROUTES.SIGN_UP}
              element={
                <AuthRoute requireAuth={false}>
                  <SignUpPage />
                </AuthRoute>
              }
            />
            <Route
              path={ROUTES.FORGOT_PASSWORD}
              element={
                <AuthRoute requireAuth={false}>
                  <ForgotPasswordPage />
                </AuthRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <AuthRoute requireAuth>
                  <DashboardPage />
                </AuthRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}
