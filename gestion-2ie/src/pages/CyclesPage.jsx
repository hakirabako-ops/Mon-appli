// src/pages/CyclesPage.jsx
import CrudPage from '../components/CrudPage';
import { cyclesService } from '../services/cyclesService';
import { niveauxService } from '../services/niveauxService';

const cyclesConfig = {
  title: 'Cycles',
  category: 'Ressources',
  singular: 'cycle',
  description: 'Gérez les cycles de formation (Licence, Master, Doctorat, etc.)',
  listTitle: 'Liste des cycles',
  service: cyclesService,
  pagination: { enabled: true, pageSize: 25 },
  dependencies: {
    niveaux: { field: 'cycles_id', service: niveauxService },
  },
  fields: [
    { name: 'libelle', label: 'Libellé', required: true, placeholder: 'Licence' },
    { name: 'duree_annees', label: 'Durée (années)', type: 'number', required: true, placeholder: '3' },
  ],
  columns: [
    { name: 'libelle', label: 'Libellé' },
    { name: 'duree_annees', label: 'Durée' },
  ],
};

export default function CyclesPage() {
  return <CrudPage config={cyclesConfig} />;
}