import CrudPage from '../components/CrudPage';
import StatusBadge from '../components/StatusBadge';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';
import { decisionsService } from '../services/decisionsService';
import { etudiantsService } from '../services/etudiantsService';
import { inscriptionsService } from '../services/inscriptionsService';
import { parcoursService } from '../services/parcoursService';

const studentLabel = (s) => `${s.nom || ''} ${s.prenoms || ''}`.trim();

const numberFmt = new Intl.NumberFormat('fr-FR');

const inscriptionsConfig = {
  title: 'Inscriptions',
  category: 'Gestion Étudiants',
  singular: 'inscription',
  description: "Inscrivez un étudiant dans un parcours pour une année académique.",
  listTitle: 'Liste des inscriptions',
  service: inscriptionsService,
  pagination: { enabled: true, pageSize: 25 },
  enableExport: true,
  hideAddButton: true,
  fields: [
    { name: 'etudiants_id',        label: 'Étudiant',          type: 'select', service: etudiantsService,        optionLabel: studentLabel, required: true },
    { name: 'parcours_id',         label: 'Parcours',           type: 'select', service: parcoursService,         required: true },
    { name: 'annee_academique_id', label: 'Année académique',   type: 'select', service: anneesAcademiquesService, required: true },
    { name: 'decisions_id',        label: 'Décision',           type: 'select', service: decisionsService,        required: true },
    { name: 'date_inscription',    label: "Date d'inscription", type: 'date',   required: true },
    { name: 'montant_paye',        label: 'Montant payé',       type: 'number', placeholder: '0' },
    { name: 'statut_paiement',     label: 'Statut paiement',   placeholder: 'impayé' },
  ],
  columns: [
    { name: 'etudiants_id',        label: 'Étudiant',    optionField: 'etudiants_id', optionLabel: studentLabel },
    { name: 'parcours_id',         label: 'Parcours',    optionField: 'parcours_id' },
    { name: 'annee_academique_id', label: 'Année',       optionField: 'annee_academique_id' },
    { name: 'date_inscription',    label: 'Date',        render: (v) => String(v || '').slice(0, 10) },
    { name: 'montant_paye',        label: 'Montant',     render: (v) => v ? `${numberFmt.format(v)} FCFA` : '—' },
    { name: 'statut_paiement',     label: 'Statut',      render: (v) => <StatusBadge value={v} />, sortable: false },
  ],
};

export default function InscriptionsPage() {
  return <CrudPage config={inscriptionsConfig} />;
}
