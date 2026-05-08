import CrudPage from '../components/CrudPage';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';
import { decisionsService } from '../services/decisionsService';
import { etudiantsService } from '../services/etudiantsService';
import { inscriptionsService } from '../services/inscriptionsService';
import { parcoursService } from '../services/parcoursService';

const studentLabel = (student) => `${student.nom || ''} ${student.prenoms || ''}`.trim();

const inscriptionsConfig = {
  title: 'Inscriptions',
  category: 'Gestion Etudiants',
  singular: 'inscription',
  description: 'Inscrivez un etudiant dans un parcours pour une annee academique.',
  listTitle: 'Liste des inscriptions',
  service: inscriptionsService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'etudiants_id', label: 'Etudiant', type: 'select', service: etudiantsService, optionLabel: studentLabel, required: true },
    { name: 'parcours_id', label: 'Parcours', type: 'select', service: parcoursService, required: true },
    { name: 'annee_academique_id', label: 'Annee academique', type: 'select', service: anneesAcademiquesService, required: true },
    { name: 'decisions_id', label: 'Decision', type: 'select', service: decisionsService, required: true },
    { name: 'date_inscription', label: 'Date inscription', type: 'date', required: true },
    { name: 'montant_paye', label: 'Montant paye', type: 'number', placeholder: '0' },
    { name: 'statut_paiement', label: 'Statut paiement', placeholder: 'impaye' },
  ],
  columns: [
    { name: 'etudiants_id', label: 'Etudiant', optionField: 'etudiants_id', optionLabel: studentLabel },
    { name: 'parcours_id', label: 'Parcours', optionField: 'parcours_id' },
    { name: 'annee_academique_id', label: 'Annee', optionField: 'annee_academique_id' },
    { name: 'date_inscription', label: 'Date', render: (value) => String(value || '').slice(0, 10) },
    { name: 'montant_paye', label: 'Montant' },
    { name: 'statut_paiement', label: 'Paiement' },
  ],
  hideAddButton: true,  // Cache le bouton d'ajout
  enableExport: true,   // Garde l'export
};

export default function InscriptionsPage() {
  return <CrudPage config={inscriptionsConfig} />;
}
