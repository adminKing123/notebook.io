import AuthStepIndicator from './AuthStepIndicator';
import './auth.css';

export default function AuthLayout({
  title,
  description,
  currentStep,
  stepCount,
  stepLabels,
  showProgress = true,
  children,
}) {
  return (
    <div className="auth">
      <div className="auth__container">
        <header className="auth__header">
          <p className="auth__brand">Personal Diary</p>
          <h1 className="auth__title">{title}</h1>
          {description && <p className="auth__description">{description}</p>}
        </header>

        {showProgress && (
          <AuthStepIndicator
            currentStep={currentStep}
            stepCount={stepCount}
            stepLabels={stepLabels}
          />
        )}

        <div className="auth__body">{children}</div>
      </div>
    </div>
  );
}
