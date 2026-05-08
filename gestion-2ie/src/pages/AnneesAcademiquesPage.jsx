import CrudPage from '../components/CrudPage';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';

const anneesConfig = {
  title: 'Annees Academiques',
  category: 'Ressources',
  singular: 'annee academique',
  description: 'Gerez les periodes academiques et definissez celle active.',
  listTitle: 'Liste des annees academiques',
  service: anneesAcademiquesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true, placeholder: '2025-2026' },
    { name: 'date_debut', label: 'Date debut', type: 'date', required: true },
    { name: 'date_fin', label: 'Date fin', type: 'date', required: true },
    { name: 'est_active', label: 'Annee active', type: 'checkbox' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'date_debut', label: 'Date debut', render: (value) => String(value || '').slice(0, 10) },
    { name: 'date_fin', label: 'Date fin', render: (value) => String(value || '').slice(0, 10) },
    { name: 'est_active', label: 'Active', render: (value) => (value ? 'Oui' : 'Non') },
  ],
};

export default function AnneesAcademiquesPage() {
  return <CrudPage config={anneesConfig} />;
}
