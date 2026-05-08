import CrudPage from '../components/CrudPage';
import { paysService } from '../services/paysService';

const paysConfig = {
  title: 'Pays',
  category: 'Ressources',
  singular: 'pays',
  description: 'Gerez le catalogue des pays utilises dans les formulaires.',
  listTitle: 'Liste des pays',
  service: paysService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true },
    { name: 'code', label: 'Code', placeholder: 'BFA' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'code', label: 'Code' },
  ],
};

export default function PaysPage() {
  return <CrudPage config={paysConfig} />;
}
