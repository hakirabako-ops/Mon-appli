import CrudPage from '../components/CrudPage';
import { cyclesService } from '../services/cyclesService';
import { niveauxService } from '../services/niveauxService';
import { parcoursService } from '../services/parcoursService';

const niveauxConfig = {
  title: 'Niveaux',
  category: 'Ressources',
  singular: 'niveau',
  description: 'Paramétrez les niveaux et leur ordre dans chaque cycle.',
  listTitle: 'Liste des niveaux',
  service: niveauxService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    parcours: { field: 'niveaux_id', service: parcoursService },
  },
  fields: [
    { name: 'libelle',   label: 'Libellé', required: true },
    { name: 'ordre',     label: 'Ordre',   type: 'number', required: true },
    { name: 'cycles_id', label: 'Cycle',   type: 'select', service: cyclesService, required: true },
  ],
  columns: [
    { name: 'libelle',   label: 'Libellé' },
    { name: 'ordre',     label: 'Ordre' },
    { name: 'cycles_id', label: 'Cycle',  optionField: 'cycles_id' },
  ],
};

export default function NiveauxPage() {
  return <CrudPage config={niveauxConfig} />;
}
