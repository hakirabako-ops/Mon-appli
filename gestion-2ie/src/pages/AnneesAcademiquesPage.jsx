import CrudPage from '../components/CrudPage';
import StatusBadge from '../components/StatusBadge';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';

const anneesConfig = {
  title: 'Années académiques',
  category: 'Ressources',
  singular: 'année académique',
  description: 'Gérez les périodes académiques et définissez celle qui est active.',
  listTitle: 'Liste des années académiques',
  service: anneesAcademiquesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle',     label: 'Libellé',        required: true, placeholder: '2025-2026' },
    { name: 'date_debut',  label: 'Date de début',  type: 'date', required: true },
    { name: 'date_fin',    label: 'Date de fin',    type: 'date', required: true },
    { name: 'est_active',  label: 'Année active',   type: 'checkbox' },
  ],
  columns: [
    { name: 'libelle',    label: 'Libellé' },
    { name: 'date_debut', label: 'Début',  render: (v) => String(v || '').slice(0, 10) },
    { name: 'date_fin',   label: 'Fin',    render: (v) => String(v || '').slice(0, 10) },
    { name: 'est_active', label: 'Statut', render: (v) => <StatusBadge value={v ? 'oui' : 'non'} />, sortable: false },
  ],
};

export default function AnneesAcademiquesPage() {
  return <CrudPage config={anneesConfig} />;
}
