import { useEffect, useMemo, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faChevronLeft,
  faChevronRight,
  faPenToSquare,
  faPlus,
  faTrash,
  faXmark,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { exportToCSV, exportToExcel, importFromCSV, importFromExcel } from '../utils/importExport';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from './ConfirmDialog';
import ToastNotification from './ToastNotification';
import Spinner from './Spinner';

function emptyValue(field) {
  return field.type === 'checkbox' ? false : '';
}

function createInitialForm(fields) {
  return fields.reduce((form, field) => ({ ...form, [field.name]: emptyValue(field) }), {});
}

function normalizeFormValue(field, value) {
  if (field.type === 'checkbox') return Boolean(value);
  if (field.type === 'date' && value) return String(value).slice(0, 10);
  return value ?? '';
}

function optionText(option, labelKey) {
  if (typeof labelKey === 'function') return labelKey(option);
  return option[labelKey || 'libelle'] || option.nom || option.id;
}

function displayValue(item, column, options) {
  const value = item[column.name];

  if (column.optionField) {
    const option = (options[column.optionField] || []).find((entry) => String(entry.id) === String(value));
    return option ? optionText(option, column.optionLabel) : value || '-';
  }

  if (column.render) return column.render(value, item);
  if (value === null || value === undefined || value === '') return <span style={{ color: 'var(--c-text-muted)' }}>-</span>;
  return value;
}

export default function CrudPage({ config }) {
  const initialForm = useMemo(() => createInitialForm(config.fields), [config]);
  const { toast, showSuccess, showError, closeToast } = useToast();
  const [items, setItems] = useState([]);
  const [options, setOptions] = useState({});
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // Détermine si les boutons d'export doivent être affichés
  const showExportButtons = config.enableExport === true;
  // Détermine si le bouton d'ajout doit être masqué
  const hideAddButton = config.hideAddButton === true;

  const searchEnabled = config.searchable === true;
  const filteredItems = searchEnabled
    ? items.filter(item =>
        config.searchFields?.some(field =>
          String(item[field]).toLowerCase().includes(search.toLowerCase())
        )
      )
    : items;

  const paginationEnabled = Boolean(config.pagination?.enabled);
  const pageSize = Number(config.pagination?.pageSize) > 0 ? Number(config.pagination.pageSize) : 25;
  const totalPages = paginationEnabled ? Math.max(1, Math.ceil(filteredItems.length / pageSize)) : 1;
  const paginatedItems = paginationEnabled
    ? filteredItems.slice((page - 1) * pageSize, page * pageSize)
    : filteredItems;
  const pageStart = filteredItems.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = paginationEnabled ? Math.min(page * pageSize, filteredItems.length) : filteredItems.length;

  useEffect(() => {
    async function loadPageData() {
      setLoading(true);
      setError('');

      try {
        const optionEntries = await Promise.all(
          config.fields
            .filter((field) => field.type === 'select' && field.service)
            .map(async (field) => [field.name, await field.service.list()])
        );

        setOptions(Object.fromEntries(optionEntries));
        setItems(await config.service.list());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setMessage('');
    setPage(1);
    loadPageData();
  }, [config, initialForm]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setMessage('');
    setError('');
  }

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  function editItem(item) {
    setShowForm(true);
    setEditingId(item.id);
    setMessage('');
    setError('');
    setForm(
      config.fields.reduce((nextForm, field) => ({
        ...nextForm,
        [field.name]: normalizeFormValue(field, item[field.name]),
      }), {})
    );
  }

  function deleteItem(id) {
    setDeleteItemId(id);
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    if (!deleteItemId) return;

    setMessage('');
    setError('');
    setDeleting(true);

    try {
      // Supprimer les dépendances d'abord
      if (config.dependencies) {
        for (const [depKey, depConfig] of Object.entries(config.dependencies)) {
          const dependents = await depConfig.service.findByField(depConfig.field, deleteItemId);
          
          for (const dependent of dependents) {
            await depConfig.service.remove(dependent.id);
          }
        }
      }

      // Puis supprimer l'item principal
      await config.service.remove(deleteItemId);
      setItems((current) => current.filter((item) => item.id !== deleteItemId));
      showSuccess(`${config.singular} supprimé avec succès.`);

      if (editingId === deleteItemId) {
        resetForm();
        setShowForm(false);
      }

      setShowDeleteConfirm(false);
      setDeleteItemId(null);
    } catch (err) {
      showError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  async function saveItem(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = config.fields.reduce((data, field) => ({
        ...data,
        [field.name]: field.type === 'checkbox' ? (form[field.name] ? 1 : 0) : form[field.name],
      }), {});

      if (editingId) {
        const updated = await config.service.update(editingId, payload);
        setItems((current) => current.map((item) => (item.id === editingId ? updated : item)));
        showSuccess(`${config.singular} modifié avec succès.`);
      } else {
        const created = await config.service.create(payload);
        setItems((current) => [created, ...current]);
        setPage(1);
        showSuccess(`${config.singular} enregistré avec succès.`);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      setError('');
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setMessage('');
    setError('');

    try {
      let importedItems = [];
      
      if (file.name.endsWith('.csv')) {
        importedItems = await importFromCSV(file, config.fields);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importedItems = await importFromExcel(file, config.fields);
      } else {
        throw new Error('Format de fichier non supporté. Utilisez CSV ou Excel.');
      }

      if (importedItems.length === 0) {
        throw new Error('Aucune donnée valide trouvée dans le fichier.');
      }

      // Créer les items
      let created = 0;
      for (const item of importedItems) {
        try {
          await config.service.create(item);
          created++;
        } catch (err) {
          console.error('Erreur lors de la création d\'un item:', err.message);
        }
      }

      setItems(await config.service.list());
      setPage(1);
      showSuccess(`${created} ${config.singular}(s) importé(s) avec succès.`);
      fileInputRef.current.value = '';
    } catch (err) {
      showError(err.message);
    } finally {
      setImporting(false);
    }
  }

  function handleExportCSV() {
    setError('');
    try {
      exportToCSV(filteredItems, config.columns, config.title || 'export');
      showSuccess('Export CSV téléchargé.');
    } catch (err) {
      showError(err.message);
    }
  }

  function handleExportExcel() {
    setError('');
    try {
      exportToExcel(filteredItems, config.columns, config.title || 'export');
      showSuccess('Export Excel téléchargé.');
    } catch (err) {
      showError(err.message);
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{config.category || 'Ressources'}</p>
          <h1 className="page-title">{config.title}</h1>
          <p className="page-desc">{config.description}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* 🟢 BOUTON AJOUTER - Masqué si hideAddButton est true */}
          {!hideAddButton && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setShowForm((visible) => !visible);
                if (showForm) resetForm();
              }}
            >
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faPlus} aria-hidden="true" />
              {editingId ? 'Edition en cours' : `Ajouter ${config.singular}`}
            </button>
          )}

          {/* 🟢 BOUTONS D'EXPORT - Uniquement si enableExport est true */}
          {showExportButtons && (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleExportCSV}
                disabled={filteredItems.length === 0}
                title="Exporter en CSV"
                aria-label="Exporter en CSV"
              >
                <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
                CSV
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleExportExcel}
                disabled={filteredItems.length === 0}
                title="Exporter en Excel"
                aria-label="Exporter en Excel"
              >
                <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
                Excel
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                title="Importer un fichier"
                aria-label="Importer un fichier"
              >
                <FontAwesomeIcon icon={faUpload} aria-hidden="true" />
                {importing ? 'Import...' : 'Importer'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                style={{ display: 'none' }}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>

      {message && (
        <div className="feedback feedback-success">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
          {message}
        </div>
      )}
      {error && (
        <div className="feedback feedback-error">
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          {error}
        </div>
      )}

      {showForm && !hideAddButton && (
        <div className="form-card">
          <div className="form-card-title">{editingId ? `Modifier ${config.singular}` : `Nouveau ${config.singular}`}</div>
          <form onSubmit={saveItem}>
            <div className="form-grid">
              {config.fields.map((field) => (
                <div className="form-field" key={field.name}>
                  <label className="form-label" htmlFor={field.name}>
                    {field.label}{field.required ? ' *' : ''}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea id={field.name} name={field.name} className="form-input" value={form[field.name]} onChange={handleChange} required={field.required} />
                  ) : field.type === 'select' ? (
                    <select id={field.name} name={field.name} className="form-input" value={form[field.name]} onChange={handleChange} required={field.required}>
                      <option value="">Selectionner</option>
                      {(options[field.name] || []).map((option) => (
                        <option key={option.id} value={option.id}>{optionText(option, field.optionLabel)}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="form-check">
                      <input id={field.name} name={field.name} type="checkbox" checked={Boolean(form[field.name])} onChange={handleChange} />
                      <span>Oui</span>
                    </label>
                  ) : (
                    <input id={field.name} name={field.name} className="form-input" type={field.type || 'text'} value={form[field.name]} onChange={handleChange} required={field.required} placeholder={field.placeholder || ''} />
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Enregistrement...' : editingId ? 'Mettre a jour' : 'Enregistrer'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">{config.listTitle || 'Liste'}</span>
          <span className="badge-count">{filteredItems.length}</span>
        </div>

        {searchEnabled && (
          <div style={{ padding: '16px', borderBottom: '1px solid var(--c-border)' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--c-border)',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <Spinner size="md" text="Chargement..." />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">{search && searchEnabled ? 'Aucun resultat trouvé.' : config.emptyText || 'Aucun element enregistre pour le moment.'}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {config.columns.map((column) => <th key={column.name}>{column.label}</th>)}
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((column) => (
                    <td key={column.name}>{displayValue(item, column, options)}</td>
                  ))}
                  <td>
                    <div className="table-actions-cell">
                      <button type="button" className="btn-icon btn-icon-edit" onClick={() => editItem(item)} title="Modifier" aria-label="Modifier">
                        <FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" />
                      </button>
                      <button type="button" className="btn-icon btn-icon-delete" onClick={() => deleteItem(item.id)} title="Supprimer" aria-label="Supprimer">
                        <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {paginationEnabled && filteredItems.length > 0 && (
          <div className="pagination-bar">
            <div className="pagination-info">
              {pageStart}-{pageEnd} sur {filteredItems.length}
            </div>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-secondary pagination-btn"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                aria-label="Page precedente"
              >
                <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              </button>
              <span className="pagination-current">Page {page} / {totalPages}</span>
              <button
                type="button"
                className="btn-secondary pagination-btn"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                aria-label="Page suivante"
              >
                <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmation de suppression"
        message={`Êtes-vous sûr(e) de vouloir supprimer cet(te) ${config.singular} ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteItemId(null);
        }}
        loading={deleting}
      />

      <ToastNotification
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
        autoClose={3000}
      />
    </>
  );
}