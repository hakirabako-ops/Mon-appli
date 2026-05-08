import CrudPage from '../components/CrudPage';
import { filieresService } from '../services/filieresService';
import { specialitesService } from '../services/specialitesService';
import { parcoursService } from '../services/parcoursService';

const specialitesConfig = {
  title: 'Specialites',
  category: 'Ressources',
  singular: 'specialite',
  description: 'Rattachez les specialites aux filieres.',
  listTitle: 'Liste des specialites',
  service: specialitesService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    parcours: { field: 'specialites_id', service: parcoursService },
  },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true },
    { name: 'filieres_id', label: 'Filiere', type: 'select', service: filieresService, required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'filieres_id', label: 'Filiere', optionField: 'filieres_id' },
    { name: 'description', label: 'Description' },
  ],
};

export default function SpecialitesPage() {
  return <CrudPage config={specialitesConfig} />;
}
