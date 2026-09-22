import { useRef } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import { getDateOfBirthBounds } from '../../utils/date';
import './forms.css';

export default function DateField({
  id,
  label,
  value,
  onChange,
  min,
  max,
}) {
  const inputRef = useRef(null);
  const bounds = getDateOfBirthBounds();

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <div className="ui-field ui-field--date">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="ui-field__row">
        <div className="ui-field__input-wrap">
          <input
            ref={inputRef}
            id={id}
            className="ui-field__input ui-field__input--date"
            type="date"
            value={value}
            onChange={onChange}
            min={min ?? bounds.min}
            max={max ?? bounds.max}
            autoComplete="bday"
          />
          <button
            type="button"
            className="ui-field__date-trigger"
            title="Choose date"
            aria-label="Choose date"
            onClick={openPicker}
          >
            <MdCalendarToday />
          </button>
        </div>
      </div>
    </div>
  );
}
