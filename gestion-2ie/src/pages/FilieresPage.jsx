import CrudPage from '../components/CrudPage';
import { filieresService } from '../services/filieresService';
import { specialitesService } from '../services/specialitesService';

const filieresConfig = {
  title: 'Filieres',
  category: 'Ressources',
  singular: 'filiere',
  description: 'Gerez les filieres disponibles dans le systeme.',
  listTitle: 'Liste des filieres',
  service: filieresService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    specialites: { field: 'filieres_id', service: specialitesService },
  },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'description', label: 'Description' },
  ],
};

export default function FilieresPage() {
  return <CrudPage config={filieresConfig} />;
}
