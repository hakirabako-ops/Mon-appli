import CrudPage from '../components/CrudPage';
import { createEcole, deleteEcole, getEcoles, updateEcole } from '../services/ecoleService';

const ecolesService = {
  list: getEcoles,
  create: createEcole,
  update: updateEcole,
  remove: deleteEcole,
};

const ecoleConfig = {
  title: 'Ecoles',
  category: 'Ressources',
  singular: 'ecole',
  description: 'Gerez les ecoles et etablissements partenaires.',
  listTitle: 'Liste des ecoles',
  service: ecolesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle', label: 'Libelle', required: true, placeholder: "Nom de l'ecole" },
    { name: 'code', label: 'Code', placeholder: 'Code identifiant' },
    { name: 'adresse', label: 'Adresse', placeholder: 'Adresse complete' },
    { name: 'telephone', label: 'Telephone', placeholder: '+226 00 00 00 00' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'contact@ecole.com' },
  ],
  columns: [
    { name: 'libelle', label: 'Libelle' },
    { name: 'code', label: 'Code' },
    { name: 'adresse', label: 'Adresse' },
    { name: 'telephone', label: 'Telephone' },
    { name: 'email', label: 'Email' },
  ],
};

export default function EcolePage() {
  return <CrudPage config={ecoleConfig} />;
}
