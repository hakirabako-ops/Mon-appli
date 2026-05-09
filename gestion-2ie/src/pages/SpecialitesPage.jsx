import CrudPage from '../components/CrudPage';
import { filieresService } from '../services/filieresService';
import { specialitesService } from '../services/specialitesService';
import { parcoursService } from '../services/parcoursService';

const specialitesConfig = {
  title: 'Spécialités',
  category: 'Ressources',
  singular: 'spécialité',
  description: 'Rattachez les spécialités aux filières.',
  listTitle: 'Liste des spécialités',
  service: specialitesService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    parcours: { field: 'specialites_id', service: parcoursService },
  },
  fields: [
    { name: 'libelle',     label: 'Libellé',    required: true },
    { name: 'filieres_id', label: 'Filière',    type: 'select', service: filieresService, required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { name: 'libelle',     label: 'Libellé' },
    { name: 'filieres_id', label: 'Filière',    optionField: 'filieres_id' },
    { name: 'description', label: 'Description' },
  ],
};

export default function SpecialitesPage() {
  return <CrudPage config={specialitesConfig} />;
}
