import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import AuthRoute from './components/auth/AuthRoute';
import CreateNotebookPage from './pages/create-notebook/CreateNotebookPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotebookPage from './pages/notebook/NotebookPage';
import ForgotPasswordPage from './pages/forgot-password/ForgotPasswordPage';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from './pages/sign-up/SignUpPage';
import { ROUTES } from './routes';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
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
            <Route
              path={ROUTES.CREATE_NOTEBOOK}
              element={
                <AuthRoute requireAuth>
                  <CreateNotebookPage />
                </AuthRoute>
              }
            />
            <Route
              path={ROUTES.NOTEBOOK}
              element={
                <AuthRoute requireAuth>
                  <NotebookPage />
                </AuthRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
