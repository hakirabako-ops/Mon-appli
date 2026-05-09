import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPrint, faFilter, faEye } from '@fortawesome/free-solid-svg-icons';
import { etudiantsService } from '../services/etudiantsService';
import { civilitesService } from '../services/civilitesService';
import { paysService } from '../services/paysService';
import { exportToCSV, exportToExcel } from '../utils/importExport';
import { useToast } from '../hooks/useToast';
import ToastNotification from '../components/ToastNotification';
import Spinner from '../components/Spinner';

const EXPORT_COLUMNS = [
  { name: 'nom', label: 'Nom' },
  { name: 'prenoms', label: 'Prénoms' },
  { name: 'civilite', label: 'Civilité' },
  { name: 'pays', label: 'Pays' },
  { name: 'email', label: 'Email' },
  { name: 'telephone', label: 'Téléphone' },
  { name: 'date_naissance', label: 'Date naissance' },
];

export default function ListesEtudiantsPage() {
  const { toast, showSuccess, showError, closeToast } = useToast();
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [civilites, setCivilites] = useState([]);
  const [pays, setPays] = useState([]);
  const [filters, setFilters] = useState({ civilite: '', pays: '', search: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [filters, etudiants]);

  async function loadData() {
    setLoading(true);
    try {
      const [etudiantsData, civilitesData, paysData] = await Promise.all([
        etudiantsService.list(),
        civilitesService.list(),
        paysService.list(),
      ]);
      setEtudiants(etudiantsData);
      setFilteredEtudiants(etudiantsData);
      setCivilites(civilitesData);
      setPays(paysData);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...etudiants];
    if (filters.civilite) filtered = filtered.filter((e) => String(e.civilites_id) === filters.civilite);
    if (filters.pays) filtered = filtered.filter((e) => String(e.pays_id) === filters.pays);
    if (filters.search) {
      const lower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.nom.toLowerCase().includes(lower) ||
          e.prenoms.toLowerCase().includes(lower) ||
          e.email?.toLowerCase().includes(lower)
      );
    }
    setFilteredEtudiants(filtered);
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function buildExportData() {
    return filteredEtudiants.map((e) => ({
      ...e,
      civilite: civilites.find((c) => c.id === e.civilites_id)?.libelle || '',
      pays: pays.find((p) => p.id === e.pays_id)?.libelle || '',
    }));
  }

  function handleExportCSV() {
    exportToCSV(buildExportData(), EXPORT_COLUMNS, 'liste_etudiants');
    showSuccess('Export CSV téléchargé');
  }

  function handleExportExcel() {
    exportToExcel(buildExportData(), EXPORT_COLUMNS, 'liste_etudiants');
    showSuccess('Export Excel téléchargé');
  }

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Gestion Étudiants</p>
          <h1 className="page-title">Listes des étudiants</h1>
          <p className="page-desc">Consultez, filtrez et exportez la liste des étudiants.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={handleExportCSV} disabled={filteredEtudiants.length === 0}>
            <FontAwesomeIcon icon={faDownload} /> CSV
          </button>
          <button className="btn-secondary" onClick={handleExportExcel} disabled={filteredEtudiants.length === 0}>
            <FontAwesomeIcon icon={faDownload} /> Excel
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faPrint} /> Imprimer
          </button>
        </div>
      </div>

      <div className="form-card filter-card">
        <div className="form-card-title">
          <FontAwesomeIcon icon={faFilter} /> Filtres
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Recherche</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="Nom, prénom ou email..."
            />
          </div>
          <div className="form-field">
            <label className="form-label">Civilité</label>
            <select name="civilite" value={filters.civilite} onChange={handleFilterChange} className="form-input">
              <option value="">Toutes</option>
              {civilites.map((c) => (
                <option key={c.id} value={c.id}>{c.libelle}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Pays</label>
            <select name="pays" value={filters.pays} onChange={handleFilterChange} className="form-input">
              <option value="">Tous</option>
              {pays.map((p) => (
                <option key={p.id} value={p.id}>{p.libelle}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <span className="table-card-title">Résultats</span>
          <span className="badge-count">{filteredEtudiants.length} étudiant(s)</span>
        </div>

        {loading ? (
          <div className="empty-state"><Spinner size="md" text="Chargement..." /></div>
        ) : filteredEtudiants.length === 0 ? (
          <div className="empty-state">Aucun étudiant trouvé.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénoms</th>
                <th>Civilité</th>
                <th>Pays</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEtudiants.map((etudiant) => (
                <tr key={etudiant.id}>
                  <td>{etudiant.nom}</td>
                  <td>{etudiant.prenoms}</td>
                  <td>{civilites.find((c) => c.id === etudiant.civilites_id)?.libelle || '-'}</td>
                  <td>{pays.find((p) => p.id === etudiant.pays_id)?.libelle || '-'}</td>
                  <td>{etudiant.email || '-'}</td>
                  <td>{etudiant.telephone || '-'}</td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        className="btn-icon btn-icon-edit"
                        onClick={() => setSelectedStudent(etudiant)}
                        title="Voir détails"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Détails de l'étudiant</h3>
            <p><strong>Nom :</strong> {selectedStudent.nom}</p>
            <p><strong>Prénoms :</strong> {selectedStudent.prenoms}</p>
            <p><strong>Civilité :</strong> {civilites.find((c) => c.id === selectedStudent.civilites_id)?.libelle || '-'}</p>
            <p><strong>Pays :</strong> {pays.find((p) => p.id === selectedStudent.pays_id)?.libelle || '-'}</p>
            <p><strong>Date naissance :</strong> {selectedStudent.date_naissance || '-'}</p>
            <p><strong>Email :</strong> {selectedStudent.email || '-'}</p>
            <p><strong>Téléphone :</strong> {selectedStudent.telephone || '-'}</p>
            <button className="btn-secondary" onClick={() => setSelectedStudent(null)}>Fermer</button>
          </div>
        </div>
      )}

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
