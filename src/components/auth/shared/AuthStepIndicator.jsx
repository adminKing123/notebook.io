export default function AuthStepIndicator({ currentStep, stepCount, stepLabels }) {
  return (
    <nav className="auth__progress" aria-label="Progress">
      <div
        className="auth__progress-track"
        style={{ gridTemplateColumns: `repeat(${stepCount}, 1fr)` }}
      >
        {Array.from({ length: stepCount }, (_, index) => (
          <span
            key={stepLabels[index]}
            className={
              index <= currentStep
                ? 'auth__progress-segment auth__progress-segment--filled'
                : 'auth__progress-segment'
            }
          />
        ))}
      </div>
      <p className="auth__progress-label">
        Step {currentStep + 1} of {stepCount} · {stepLabels[currentStep]}
      </p>
    </nav>
  );
}
