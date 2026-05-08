// pages/InscrireEtudiantPage.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faUserPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { inscriptionsService } from '../services/inscriptionsService';
import { etudiantsService } from '../services/etudiantsService';
import { parcoursService } from '../services/parcoursService';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';
import { decisionsService } from '../services/decisionsService';
import { useToast } from '../hooks/useToast';
import ToastNotification from '../components/ToastNotification';
import Spinner from '../components/Spinner';

export default function InscrireEtudiantPage() {
  const { toast, showSuccess, showError, closeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [etudiants, setEtudiants] = useState([]);
  const [parcours, setParcours] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false);
  
  const [form, setForm] = useState({
    etudiants_id: '',
    parcours_id: '',
    annee_academique_id: '',
    decisions_id: '',
    date_inscription: new Date().toISOString().split('T')[0],
    montant_paye: '',
    statut_paiement: 'impayé',
  });

  // Charger les listes déroulantes
  useEffect(() => {
    async function loadOptions() {
      setLoading(true);
      try {
        const [etudiantsData, parcoursData, anneesData, decisionsData] = await Promise.all([
          etudiantsService.list(),
          parcoursService.list(),
          anneesAcademiquesService.list(),
          decisionsService.list(),
        ]);
        setEtudiants(etudiantsData);
        setParcours(parcoursData);
        setAnnees(anneesData);
        setDecisions(decisionsData);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  // Filtrer les étudiants pour la recherche
  const filteredEtudiants = etudiants.filter(e => 
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectEtudiant = (etudiant) => {
    setSelectedEtudiant(etudiant);
    setForm(prev => ({ ...prev, etudiants_id: etudiant.id }));
    setShowStudentList(false);
    setSearchTerm('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.etudiants_id || !form.parcours_id || !form.annee_academique_id || !form.decisions_id || !form.date_inscription) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSaving(true);
    try {
      await inscriptionsService.create(form);
      showSuccess('Inscription enregistrée avec succès !');
      
      // Réinitialiser le formulaire
      setForm({
        etudiants_id: '',
        parcours_id: '',
        annee_academique_id: '',
        decisions_id: '',
        date_inscription: new Date().toISOString().split('T')[0],
        montant_paye: '',
        statut_paiement: 'impayé',
      });
      setSelectedEtudiant(null);
      setSearchTerm('');
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      etudiants_id: '',
      parcours_id: '',
      annee_academique_id: '',
      decisions_id: '',
      date_inscription: new Date().toISOString().split('T')[0],
      montant_paye: '',
      statut_paiement: 'impayé',
    });
    setSelectedEtudiant(null);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spinner size="lg" text="Chargement..." />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Gestion Étudiants</p>
          <h1 className="page-title">
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '12px' }} />
            Inscrire un étudiant
          </h1>
          <p className="page-desc">Enregistrez une nouvelle inscription pour un étudiant.</p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="form-card-title">Formulaire d'inscription</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Sélection de l'étudiant avec recherche */}
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Étudiant *</label>
              {!selectedEtudiant ? (
                <div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowStudentList(true)}
                      className="form-input"
                      placeholder="Rechercher par nom, prénom ou email..."
                    />
                    <button type="button" className="btn-secondary" onClick={() => setShowStudentList(!showStudentList)}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </div>
                  {showStudentList && searchTerm.length > 0 && (
                    <div className="student-search-results">
                      {filteredEtudiants.length === 0 ? (
                        <div className="empty-state">Aucun étudiant trouvé</div>
                      ) : (
                        filteredEtudiants.map(e => (
                          <div key={e.id} className="student-result-item" onClick={() => handleSelectEtudiant(e)}>
                            <strong>{e.nom} {e.prenoms}</strong>
                            <span style={{ fontSize: '12px', color: '#666' }}>{e.email}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="selected-student">
                  <div className="selected-student-info">
                    <strong>{selectedEtudiant.nom} {selectedEtudiant.prenoms}</strong>
                    <span>{selectedEtudiant.email}</span>
                  </div>
                  <button type="button" className="btn-icon" onClick={() => { setSelectedEtudiant(null); setForm(prev => ({ ...prev, etudiants_id: '' })); }}>
                    ✖
                  </button>
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Parcours *</label>
              <select
                name="parcours_id"
                value={form.parcours_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {parcours.map(p => (
                  <option key={p.id} value={p.id}>{p.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Année académique *</label>
              <select
                name="annee_academique_id"
                value={form.annee_academique_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {annees.map(a => (
                  <option key={a.id} value={a.id}>{a.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Décision *</label>
              <select
                name="decisions_id"
                value={form.decisions_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {decisions.map(d => (
                  <option key={d.id} value={d.id}>{d.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Date d'inscription *</label>
              <input
                type="date"
                name="date_inscription"
                value={form.date_inscription}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Montant payé (FCFA)</label>
              <input
                type="number"
                name="montant_paye"
                value={form.montant_paye}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                step="1000"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Statut paiement</label>
              <select
                name="statut_paiement"
                value={form.statut_paiement}
                onChange={handleChange}
                className="form-input"
              >
                <option value="impayé">Impayé</option>
                <option value="partiel">Partiel</option>
                <option value="payé">Payé</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
              {saving ? 'Enregistrement...' : 'Valider l\'inscription'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleReset}>
              <FontAwesomeIcon icon={faUndo} style={{ marginRight: '8px' }} />
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

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