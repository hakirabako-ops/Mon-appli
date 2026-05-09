export function optionText(option, labelKey) {
  if (typeof labelKey === 'function') return labelKey(option);
  return option[labelKey || 'libelle'] || option.nom || option.id;
}

export function displayValue(item, column, options) {
  const value = item[column.name];

  if (column.optionField) {
    const option = (options[column.optionField] || []).find(
      (entry) => String(entry.id) === String(value)
    );
    return option ? optionText(option, column.optionLabel) : value || '-';
  }

  if (column.render) return column.render(value, item);

  if (value === null || value === undefined || value === '') {
    return <span style={{ color: 'var(--c-text-muted)' }}>-</span>;
  }

  return value;
}

export function emptyValue(field) {
  return field.type === 'checkbox' ? false : '';
}

export function createInitialForm(fields) {
  return fields.reduce((form, field) => ({ ...form, [field.name]: emptyValue(field) }), {});
}

export function normalizeFormValue(field, value) {
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'date' && value) return String(value).slice(0, 10);
  return value ?? '';
}
