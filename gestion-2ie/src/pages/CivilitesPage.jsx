import CrudPage from '../components/CrudPage';
import { civilitesService } from '../services/civilitesService';

const civilitesConfig = {
  title: 'Civilités',
  category: 'Ressources',
  singular: 'civilité',
  description: 'Gérez les civilités proposées dans les fiches étudiants.',
  listTitle: 'Liste des civilités',
  service: civilitesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle',      label: 'Libellé',      required: true },
    { name: 'abreviation',  label: 'Abréviation',  placeholder: 'M.' },
  ],
  columns: [
    { name: 'libelle',     label: 'Libellé' },
    { name: 'abreviation', label: 'Abréviation' },
  ],
};

export default function CivilitesPage() {
  return <CrudPage config={civilitesConfig} />;
}
