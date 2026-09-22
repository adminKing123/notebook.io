import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import './forms.css';

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="ui-field ui-field--password">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="ui-field__row">
        <div className="ui-field__input-wrap">
          <input
            id={id}
            className="ui-field__input"
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
          />
          <button
            type="button"
            className="ui-field__toggle"
            title={isVisible ? 'Hide password' : 'Show password'}
            onClick={() => setIsVisible((previous) => !previous)}
          >
            {isVisible ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        </div>
      </div>
    </div>
  );
}
