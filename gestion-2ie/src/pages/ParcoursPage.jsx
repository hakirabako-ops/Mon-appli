import CrudPage from '../components/CrudPage';
import { niveauxService } from '../services/niveauxService';
import { parcoursService } from '../services/parcoursService';
import { specialitesService } from '../services/specialitesService';
import { etudiantsService } from '../services/etudiantsService';

const parcoursConfig = {
  title: 'Parcours',
  category: 'Ressources',
  singular: 'parcours',
  description: 'Composez les parcours avec une specialite, un niveau et les credits requis.',
  listTitle: 'Liste des parcours',
  service: parcoursService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    etudiants: { field: 'parcours_id', service: etudiantsService },
  },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true },
    { name: 'specialites_id', label: 'Specialite', type: 'select', service: specialitesService, required: true },
    { name: 'niveaux_id', label: 'Niveau', type: 'select', service: niveauxService, required: true },
    { name: 'credits_requis', label: 'Credits requis', type: 'number', placeholder: '30' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'specialites_id', label: 'Specialite', optionField: 'specialites_id' },
    { name: 'niveaux_id', label: 'Niveau', optionField: 'niveaux_id' },
    { name: 'credits_requis', label: 'Credits' },
  ],
};

export default function ParcoursPage() {
  return <CrudPage config={parcoursConfig} />;
}
