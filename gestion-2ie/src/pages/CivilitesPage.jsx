import CrudPage from '../components/CrudPage';
import { civilitesService } from '../services/civilitesService';

const civilitesConfig = {
  title: 'Civilites',
  category: 'Ressources',
  singular: 'civilite',
  description: 'Gerez les civilites proposees dans les fiches etudiants.',
  listTitle: 'Liste des civilites',
  service: civilitesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true },
    { name: 'abreviation', label: 'Abreviation', placeholder: 'M.' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'abreviation', label: 'Abreviation' },
  ],
};

export default function CivilitesPage() {
  return <CrudPage config={civilitesConfig} />;
}
