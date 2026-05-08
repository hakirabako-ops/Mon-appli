// pages/AjoutEtudiantPage.jsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { etudiantsService } from '../services/etudiantsService';
import { civilitesService } from '../services/civilitesService';
import { paysService } from '../services/paysService';
import { useToast } from '../hooks/useToast';
import ToastNotification from '../components/ToastNotification';
import Spinner from '../components/Spinner';

export default function AjoutEtudiantPage() {
  const { toast, showSuccess, showError, closeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [civilites, setCivilites] = useState([]);
  const [pays, setPays] = useState([]);
  const [form, setForm] = useState({
    nom: '',
    prenoms: '',
    civilites_id: '',
    pays_id: '',
    date_naissance: '',
    email: '',
    telephone: '',
  });

  // Charger les listes déroulantes
  useState(() => {
    async function loadOptions() {
      setLoading(true);
      try {
        const [civilitesData, paysData] = await Promise.all([
          civilitesService.list(),
          paysService.list(),
        ]);
        setCivilites(civilitesData);
        setPays(paysData);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.nom || !form.prenoms || !form.civilites_id || !form.pays_id) {
      showError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSaving(true);
    try {
      await etudiantsService.create(form);
      showSuccess('Étudiant ajouté avec succès !');
      // Réinitialiser le formulaire
      setForm({
        nom: '',
        prenoms: '',
        civilites_id: '',
        pays_id: '',
        date_naissance: '',
        email: '',
        telephone: '',
      });
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      nom: '',
      prenoms: '',
      civilites_id: '',
      pays_id: '',
      date_naissance: '',
      email: '',
      telephone: '',
    });
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
            Ajouter un étudiant
          </h1>
          <p className="page-desc">Enregistrez un nouvel étudiant dans le système.</p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="form-card-title">Formulaire d'inscription</div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Civilité *</label>
              <select
                name="civilites_id"
                value={form.civilites_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {civilites.map(c => (
                  <option key={c.id} value={c.id}>{c.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Pays *</label>
              <select
                name="pays_id"
                value={form.pays_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Sélectionner</option>
                {pays.map(p => (
                  <option key={p.id} value={p.id}>{p.libelle}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="form-input"
                placeholder="DIOP"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Prénoms *</label>
              <input
                type="text"
                name="prenoms"
                value={form.prenoms}
                onChange={handleChange}
                className="form-input"
                placeholder="Amadou"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={form.date_naissance}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="amadou.diop@example.com"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="form-input"
                placeholder="+226 XX XX XX XX"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
              {saving ? 'Enregistrement...' : 'Enregistrer l\'étudiant'}
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