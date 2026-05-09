import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { inscriptionsService } from '../services/inscriptionsService';
import { etudiantsService } from '../services/etudiantsService';
import { parcoursService } from '../services/parcoursService';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';
import { decisionsService } from '../services/decisionsService';
import { useToast } from '../hooks/useToast';
import ToastNotification from '../components/ToastNotification';
import PageLoader from '../components/PageLoader';
import StudentSearchInput from '../components/StudentSearchInput';

const EMPTY_FORM = {
  etudiants_id: '',
  parcours_id: '',
  annee_academique_id: '',
  decisions_id: '',
  date_inscription: new Date().toISOString().split('T')[0],
  montant_paye: '',
  statut_paiement: 'impayé',
};

export default function InscrireEtudiantPage() {
  const { toast, showSuccess, showError, closeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [etudiants, setEtudiants] = useState([]);
  const [parcours, setParcours] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

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

  function handleStudentSelect(etudiant) {
    setSelectedEtudiant(etudiant);
    setForm((prev) => ({ ...prev, etudiants_id: etudiant ? etudiant.id : '' }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.etudiants_id || !form.parcours_id || !form.annee_academique_id || !form.decisions_id || !form.date_inscription) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setSaving(true);
    try {
      await inscriptionsService.create(form);
      showSuccess('Inscription enregistrée avec succès !');
      setForm(EMPTY_FORM);
      setSelectedEtudiant(null);
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setSelectedEtudiant(null);
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Gestion Étudiants</p>
          <h1 className="page-title">
            <FontAwesomeIcon icon={faUserPlus} />
            {' '}Inscrire un étudiant
          </h1>
          <p className="page-desc">Enregistrez une nouvelle inscription pour un étudiant.</p>
        </div>
      </div>

      <div className="form-card form-card--centered">
        <div className="form-card-title">Formulaire d'inscription</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Sélection de l'étudiant avec recherche dédiée */}
            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Étudiant *</label>
              <StudentSearchInput
                etudiants={etudiants}
                value={selectedEtudiant}
                onChange={handleStudentSelect}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="parcours_id">Parcours *</label>
              <select
                id="parcours_id"
                name="parcours_id"
                value={form.parcours_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {parcours.map((p) => (
                  <option key={p.id} value={p.id}>{p.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="annee_academique_id">Année académique *</label>
              <select
                id="annee_academique_id"
                name="annee_academique_id"
                value={form.annee_academique_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {annees.map((a) => (
                  <option key={a.id} value={a.id}>{a.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="decisions_id">Décision *</label>
              <select
                id="decisions_id"
                name="decisions_id"
                value={form.decisions_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {decisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="date_inscription">Date d'inscription *</label>
              <input
                id="date_inscription"
                type="date"
                name="date_inscription"
                value={form.date_inscription}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="montant_paye">Montant payé (FCFA)</label>
              <input
                id="montant_paye"
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
              <label className="form-label" htmlFor="statut_paiement">Statut paiement</label>
              <select
                id="statut_paiement"
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
              <FontAwesomeIcon icon={faSave} />
              {' '}{saving ? 'Enregistrement...' : "Valider l'inscription"}
            </button>
            <button type="button" className="btn-secondary" onClick={handleReset}>
              <FontAwesomeIcon icon={faUndo} />
              {' '}Réinitialiser
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
