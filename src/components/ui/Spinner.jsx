import './spinner.css';

const SPINNER_SIZES = ['sm', 'md', 'lg', 'xl'];

export default function Spinner({
  size = 'md',
  centered = false,
  centerLayout = '',
  label = 'Loading',
  className = '',
}) {
  const resolvedSize = SPINNER_SIZES.includes(size) ? size : 'md';
  const spinner = (
    <span
      className={`ui-spinner ui-spinner--${resolvedSize} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );

  if (centered) {
    return (
      <div className={`ui-spinner-center ${centerLayout}`.trim()}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
