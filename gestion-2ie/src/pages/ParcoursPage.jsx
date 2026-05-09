import CrudPage from '../components/CrudPage';
import { niveauxService } from '../services/niveauxService';
import { parcoursService } from '../services/parcoursService';
import { specialitesService } from '../services/specialitesService';
import { etudiantsService } from '../services/etudiantsService';

const parcoursConfig = {
  title: 'Parcours',
  category: 'Ressources',
  singular: 'parcours',
  description: 'Composez les parcours avec une spécialité, un niveau et les crédits requis.',
  listTitle: 'Liste des parcours',
  service: parcoursService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    etudiants: { field: 'parcours_id', service: etudiantsService },
  },
  fields: [
    { name: 'libelle',         label: 'Libellé',         required: true },
    { name: 'specialites_id',  label: 'Spécialité',      type: 'select', service: specialitesService, required: true },
    { name: 'niveaux_id',      label: 'Niveau',          type: 'select', service: niveauxService, required: true },
    { name: 'credits_requis',  label: 'Crédits requis',  type: 'number', placeholder: '30' },
  ],
  columns: [
    { name: 'libelle',        label: 'Libellé' },
    { name: 'specialites_id', label: 'Spécialité', optionField: 'specialites_id' },
    { name: 'niveaux_id',     label: 'Niveau',     optionField: 'niveaux_id' },
    { name: 'credits_requis', label: 'Crédits' },
  ],
};

export default function ParcoursPage() {
  return <CrudPage config={parcoursConfig} />;
}
