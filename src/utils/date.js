export function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function getDateOfBirthBounds() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() - 1);

  const minDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - 120);

  return {
    min: formatIsoDate(minDate),
    max: formatIsoDate(maxDate),
  };
}

export function validateDateOfBirth(value) {
  if (!value) {
    return 'Date of birth is required.';
  }

  const date = parseIsoDate(value);
  if (!date) {
    return 'Enter a valid date of birth.';
  }

  const { min, max } = getDateOfBirthBounds();
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);

  if (date < minDate) {
    return 'Date of birth must be within the last 120 years.';
  }

  if (date > maxDate) {
    return 'You must be at least 1 year old.';
  }

  return '';
}
