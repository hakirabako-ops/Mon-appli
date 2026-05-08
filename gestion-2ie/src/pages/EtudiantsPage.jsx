// pages/EtudiantsPage.jsx
import CrudPage from '../components/CrudPage';
import { civilitesService } from '../services/civilitesService';
import { etudiantsService } from '../services/etudiantsService';
import { paysService } from '../services/paysService';

const studentName = (student) => `${student.nom || ''} ${student.prenoms || ''}`.trim();

const etudiantsConfig = {
  title: 'Etudiants',
  category: 'Gestion Etudiants',
  singular: 'etudiant',
  description: 'Enregistrez et mettez a jour les informations des etudiants.',
  listTitle: 'Liste des etudiants',
  service: etudiantsService,
  searchable: true,
  searchFields: ['nom', 'prenoms', 'email'],
  pagination: { enabled: true, pageSize: 25 },
  enableExport: true, // 🟢 ACTIVE LES BOUTONS CSV, EXCEL, IMPORTER
  fields: [
    { name: 'nom', label: 'Nom', required: true },
    { name: 'prenoms', label: 'Prenoms', required: true },
    { name: 'civilites_id', label: 'Civilite', type: 'select', service: civilitesService, required: true },
    { name: 'pays_id', label: 'Pays', type: 'select', service: paysService, required: true },
    { name: 'date_naissance', label: 'Date naissance', type: 'date' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telephone', label: 'Telephone', placeholder: '+226 00 00 00 00' },
  ],
  columns: [
    { name: 'nom', label: 'Nom' },
    { name: 'prenoms', label: 'Prenoms' },
    { name: 'civilites_id', label: 'Civilite', optionField: 'civilites_id' },
    { name: 'pays_id', label: 'Pays', optionField: 'pays_id' },
    { name: 'email', label: 'Email' },
    { name: 'telephone', label: 'Telephone' },
  ],
};

export { studentName };

export default function EtudiantsPage() {
  return <CrudPage config={etudiantsConfig} />;
}