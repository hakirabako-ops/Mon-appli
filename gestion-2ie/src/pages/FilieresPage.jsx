import CrudPage from '../components/CrudPage';
import { filieresService } from '../services/filieresService';
import { specialitesService } from '../services/specialitesService';

const filieresConfig = {
  title: 'Filières',
  category: 'Ressources',
  singular: 'filière',
  description: 'Gérez les filières disponibles dans le système.',
  listTitle: 'Liste des filières',
  service: filieresService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    specialites: { field: 'filieres_id', service: specialitesService },
  },
  fields: [
    { name: 'libelle',     label: 'Libellé',    required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { name: 'libelle',     label: 'Libellé' },
    { name: 'description', label: 'Description' },
  ],
};

export default function FilieresPage() {
  return <CrudPage config={filieresConfig} />;
}
