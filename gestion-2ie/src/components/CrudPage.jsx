import { useEffect, useMemo, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faPenToSquare,
  faPlus,
  faXmark,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { exportToCSV, exportToExcel, importFromCSV, importFromExcel } from '../utils/importExport';
import { createInitialForm, normalizeFormValue } from '../utils/crudHelpers';
import { useToast } from '../hooks/useToast';
import ConfirmDialog from './ConfirmDialog';
import ToastNotification from './ToastNotification';
import CrudFormCard from './CrudFormCard';
import CrudDataTable from './CrudDataTable';

export default function CrudPage({ config }) {
  const initialForm = useMemo(() => createInitialForm(config.fields), [config]);
  const { toast, showSuccess, showError, closeToast } = useToast();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [options, setOptions] = useState({});
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showExportButtons = config.enableExport === true;
  const hideAddButton = config.hideAddButton === true;
  const searchEnabled = config.searchable === true;

  const filteredItems = searchEnabled
    ? items.filter((item) =>
        config.searchFields?.some((field) =>
          String(item[field]).toLowerCase().includes(search.toLowerCase())
        )
      )
    : items;

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
    setSearch('');
    loadPageData();
  }, [config, initialForm]);

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
      config.fields.reduce(
        (nextForm, field) => ({
          ...nextForm,
          [field.name]: normalizeFormValue(field, item[field.name]),
        }),
        {}
      )
    );
  }

  function deleteItem(id) {
    setDeleteItemId(id);
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    if (!deleteItemId) return;
    setDeleting(true);
    try {
      if (config.dependencies) {
        for (const depConfig of Object.values(config.dependencies)) {
          const dependents = await depConfig.service.findByField(depConfig.field, deleteItemId);
          for (const dep of dependents) await depConfig.service.remove(dep.id);
        }
      }
      await config.service.remove(deleteItemId);
      setItems((current) => current.filter((item) => item.id !== deleteItemId));
      showSuccess(`${config.singular} supprimé avec succès.`);
      if (editingId === deleteItemId) { resetForm(); setShowForm(false); }
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
      const payload = config.fields.reduce(
        (data, field) => ({
          ...data,
          [field.name]: field.type === 'checkbox' ? (form[field.name] ? 1 : 0) : form[field.name],
        }),
        {}
      );

      if (editingId) {
        const updated = await config.service.update(editingId, payload);
        setItems((current) => current.map((item) => (item.id === editingId ? updated : item)));
        showSuccess(`${config.singular} modifié avec succès.`);
      } else {
        const created = await config.service.create(payload);
        setItems((current) => [created, ...current]);
        showSuccess(`${config.singular} enregistré avec succès.`);
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
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
    try {
      let importedItems = [];
      if (file.name.endsWith('.csv')) {
        importedItems = await importFromCSV(file, config.fields);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importedItems = await importFromExcel(file, config.fields);
      } else {
        throw new Error('Format non supporté. Utilisez CSV ou Excel.');
      }
      if (importedItems.length === 0) throw new Error('Aucune donnée valide trouvée.');

      let created = 0;
      for (const item of importedItems) {
        try { await config.service.create(item); created++; } catch { /* skip */ }
      }
      setItems(await config.service.list());
      showSuccess(`${created} ${config.singular}(s) importé(s) avec succès.`);
      fileInputRef.current.value = '';
    } catch (err) {
      showError(err.message);
    } finally {
      setImporting(false);
    }
  }

  function handleExportCSV() {
    try {
      exportToCSV(filteredItems, config.columns, config.title || 'export');
      showSuccess('Export CSV téléchargé.');
    } catch (err) {
      showError(err.message);
    }
  }

  function handleExportExcel() {
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

        <div className="page-header-actions">
          {!hideAddButton && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => { setShowForm((v) => !v); if (showForm) resetForm(); }}
            >
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faPlus} aria-hidden="true" />
              {editingId ? 'Édition en cours' : `Ajouter ${config.singular}`}
            </button>
          )}

          {showExportButtons && (
            <>
              <button type="button" className="btn-secondary" onClick={handleExportCSV} disabled={filteredItems.length === 0} title="Exporter en CSV">
                <FontAwesomeIcon icon={faDownload} aria-hidden="true" /> CSV
              </button>
              <button type="button" className="btn-secondary" onClick={handleExportExcel} disabled={filteredItems.length === 0} title="Exporter en Excel">
                <FontAwesomeIcon icon={faDownload} aria-hidden="true" /> Excel
              </button>
              <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={importing} title="Importer un fichier">
                <FontAwesomeIcon icon={faUpload} aria-hidden="true" />
                {importing ? 'Import...' : 'Importer'}
              </button>
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} style={{ display: 'none' }} aria-hidden="true" />
            </>
          )}
        </div>
      </div>

      {message && (
        <div className="feedback feedback-success">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" /> {message}
        </div>
      )}
      {error && (
        <div className="feedback feedback-error">
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" /> {error}
        </div>
      )}

      {showForm && !hideAddButton && (
        <CrudFormCard
          config={config}
          form={form}
          options={options}
          editingId={editingId}
          saving={saving}
          onSubmit={saveItem}
          onCancel={resetForm}
          onChange={handleChange}
        />
      )}

      <CrudDataTable
        config={config}
        items={filteredItems}
        options={options}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onEdit={editItem}
        onDelete={deleteItem}
      />

      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmation de suppression"
        message={`Êtes-vous sûr(e) de vouloir supprimer cet(te) ${config.singular} ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setDeleteItemId(null); }}
        loading={deleting}
      />

      <ToastNotification show={toast.show} type={toast.type} message={toast.message} onClose={closeToast} autoClose={3000} />
    </>
  );
}
