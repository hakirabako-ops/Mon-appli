import CrudPage from '../components/CrudPage';
import { decisionsService } from '../services/decisionsService';

const decisionsConfig = {
  title: 'Decisions',
  category: 'Ressources',
  singular: 'decision',
  description: 'Gerez les decisions utilisees pendant les inscriptions.',
  listTitle: 'Liste des decisions',
  service: decisionsService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'description', label: 'Description' },
  ],
};

export default function DecisionsPage() {
  return <CrudPage config={decisionsConfig} />;
}
