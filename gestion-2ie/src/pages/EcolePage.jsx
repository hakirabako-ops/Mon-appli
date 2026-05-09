import CrudPage from '../components/CrudPage';
import { createEcole, deleteEcole, getEcoles, updateEcole } from '../services/ecoleService';

const ecolesService = { list: getEcoles, create: createEcole, update: updateEcole, remove: deleteEcole };

const ecoleConfig = {
  title: 'Écoles',
  category: 'Ressources',
  singular: 'école',
  description: 'Gérez les écoles et établissements partenaires.',
  listTitle: 'Liste des écoles',
  service: ecolesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle',   label: 'Libellé',    required: true, placeholder: "Nom de l'école" },
    { name: 'code',      label: 'Code',        placeholder: 'Code identifiant' },
    { name: 'adresse',   label: 'Adresse',     placeholder: 'Adresse complète' },
    { name: 'telephone', label: 'Téléphone',   placeholder: '+226 00 00 00 00' },
    { name: 'email',     label: 'Email',       type: 'email', placeholder: 'contact@ecole.com' },
  ],
  columns: [
    { name: 'libelle',   label: 'Libellé' },
    { name: 'code',      label: 'Code' },
    { name: 'adresse',   label: 'Adresse' },
    { name: 'telephone', label: 'Téléphone' },
    { name: 'email',     label: 'Email' },
  ],
};

export default function EcolePage() {
  return <CrudPage config={ecoleConfig} />;
}
