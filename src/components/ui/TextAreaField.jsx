import './forms.css';

export default function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}) {
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="ui-field__textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}
