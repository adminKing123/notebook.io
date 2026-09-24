import { APP_NAME } from '../../config';
import './app-brand.css';

export default function AppBrand({ variant = 'auth', className = '' }) {
  const rootClassName = ['app-brand', `app-brand--${variant}`, className].filter(Boolean).join(' ');

  if (variant === 'navbar') {
    return (
      <div className={rootClassName}>
        <picture className="app-brand__mark-picture">
          <source srcSet="/blackbox.png" media="(prefers-color-scheme: dark)" />
          <img src="/whitebox.png" alt="" className="app-brand__mark" aria-hidden="true" />
        </picture>
        <span className="app-brand__name">{APP_NAME}</span>
      </div>
    );
  }

  return <p className={rootClassName}>{APP_NAME}</p>;
}
