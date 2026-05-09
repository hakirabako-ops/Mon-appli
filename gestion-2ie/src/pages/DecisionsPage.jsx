import CrudPage from '../components/CrudPage';
import { decisionsService } from '../services/decisionsService';

const decisionsConfig = {
  title: 'Décisions',
  category: 'Ressources',
  singular: 'décision',
  description: 'Gérez les décisions utilisées lors des inscriptions.',
  listTitle: 'Liste des décisions',
  service: decisionsService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle',     label: 'Libellé',    required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { name: 'libelle',     label: 'Libellé' },
    { name: 'description', label: 'Description' },
  ],
};

export default function DecisionsPage() {
  return <CrudPage config={decisionsConfig} />;
}
