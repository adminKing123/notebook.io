import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { ROUTES } from './routes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <main className="home">
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
