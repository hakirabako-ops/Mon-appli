import { optionText } from '../utils/crudHelpers';

/**
 * Formulaire d'ajout/modification pour les pages CRUD.
 * Reçoit la configuration, l'état du formulaire et les callbacks.
 */
export default function CrudFormCard({
  config,
  form,
  options,
  editingId,
  saving,
  onSubmit,
  onCancel,
  onChange,
}) {
  return (
    <div className="form-card">
      <div className="form-card-title">
        {editingId ? `Modifier ${config.singular}` : `Nouveau ${config.singular}`}
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          {config.fields.map((field) => (
            <div className="form-field" key={field.name}>
              <label className="form-label" htmlFor={field.name}>
                {field.label}{field.required ? ' *' : ''}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  className="form-input"
                  value={form[field.name]}
                  onChange={onChange}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  className="form-input"
                  value={form[field.name]}
                  onChange={onChange}
                  required={field.required}
                >
                  <option value="">Sélectionner</option>
                  {(options[field.name] || []).map((option) => (
                    <option key={option.id} value={option.id}>
                      {optionText(option, field.optionLabel)}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="form-check">
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={onChange}
                  />
                  <span>Oui</span>
                </label>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  className="form-input"
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={onChange}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Enregistrer'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
