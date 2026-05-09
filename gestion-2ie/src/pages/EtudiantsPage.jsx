import CrudPage from '../components/CrudPage';
import { civilitesService } from '../services/civilitesService';
import { etudiantsService } from '../services/etudiantsService';
import { paysService } from '../services/paysService';

export const studentName = (s) => `${s.nom || ''} ${s.prenoms || ''}`.trim();

const etudiantsConfig = {
  title: 'Étudiants',
  category: 'Gestion Étudiants',
  singular: 'étudiant',
  description: 'Enregistrez et mettez à jour les informations des étudiants.',
  listTitle: 'Liste des étudiants',
  service: etudiantsService,
  searchable: true,
  searchFields: ['nom', 'prenoms', 'email'],
  pagination: { enabled: true, pageSize: 25 },
  enableExport: true,
  fields: [
    { name: 'nom',          label: 'Nom',              required: true },
    { name: 'prenoms',      label: 'Prénoms',          required: true },
    { name: 'civilites_id', label: 'Civilité',         type: 'select', service: civilitesService, required: true },
    { name: 'pays_id',      label: 'Pays',             type: 'select', service: paysService, required: true },
    { name: 'date_naissance', label: 'Date de naissance', type: 'date' },
    { name: 'email',        label: 'Email',            type: 'email' },
    { name: 'telephone',    label: 'Téléphone',        placeholder: '+226 00 00 00 00' },
  ],
  columns: [
    { name: 'nom',          label: 'Nom' },
    { name: 'prenoms',      label: 'Prénoms' },
    { name: 'civilites_id', label: 'Civilité', optionField: 'civilites_id' },
    { name: 'pays_id',      label: 'Pays',     optionField: 'pays_id' },
    { name: 'email',        label: 'Email' },
    { name: 'telephone',    label: 'Téléphone' },
  ],
};

export default function EtudiantsPage() {
  return <CrudPage config={etudiantsConfig} />;
}
