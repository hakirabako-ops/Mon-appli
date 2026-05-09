import CrudPage from '../components/CrudPage';
import { classesService } from '../services/classesService';
import { parcoursService } from '../services/parcoursService';
import { anneesAcademiquesService } from '../services/anneesAcademiquesService';

const classesConfig = {
  title: 'Classes',
  category: 'Ressources',
  singular: 'classe',
  description: "Gérez les classes et les groupes d'étudiants.",
  listTitle: 'Liste des classes',
  service: classesService,
  pagination: { enabled: true, pageSize: 25 },
  fields: [
    { name: 'libelle',             label: 'Libellé',         required: true, placeholder: 'Licence 1 Informatique A' },
    { name: 'code',                label: 'Code',            placeholder: 'L1-INFO-A' },
    { name: 'parcours_id',         label: 'Parcours',        type: 'select', service: parcoursService,          required: true },
    { name: 'annee_academique_id', label: 'Année académique', type: 'select', service: anneesAcademiquesService, required: true },
    { name: 'capacite_max',        label: 'Capacité max',    type: 'number', placeholder: '30' },
    { name: 'description',         label: 'Description',     type: 'textarea' },
  ],
  columns: [
    { name: 'libelle',             label: 'Libellé' },
    { name: 'code',                label: 'Code' },
    { name: 'parcours_id',         label: 'Parcours', optionField: 'parcours_id' },
    { name: 'annee_academique_id', label: 'Année',    optionField: 'annee_academique_id' },
    { name: 'capacite_max',        label: 'Capacité' },
    { name: 'effectif_actuel',     label: 'Effectif' },
  ],
};

export default function ClassePage() {
  return <CrudPage config={classesConfig} />;
}
